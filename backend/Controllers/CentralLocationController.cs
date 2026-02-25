using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Dtos;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CentralLocationController : ControllerBase
    {
        private static readonly List<CentralLocation> _locations = new();

        // --------------------
        // POST: Admin creates equipments
        // --------------------
        [HttpPost]
        public IActionResult Create([FromBody] CentralLocationDto dto)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Admin)
                return Forbid();

            var allExistingIds = _locations.SelectMany(loc => loc.Equipments)
                                           .Select(e => e.Id)
                                           .ToHashSet();

            var incomingIds = dto.Equipments?.Select(e => e.Id).ToList() ?? new();

            // Check for duplicates within the submitted list
            var incomingDuplicates = incomingIds
                .GroupBy(id => id)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (incomingDuplicates.Any())
                return BadRequest($"Duplicate equipment IDs in request: {string.Join(", ", incomingDuplicates)}.");

            // Check for conflicts with already registered equipments
            var conflicts = incomingIds.Where(id => allExistingIds.Contains(id)).ToList();

            if (conflicts.Any())
                return BadRequest($"Equipment IDs already exist: {string.Join(", ", conflicts)}.");

            var centralLocation = new CentralLocation();

            foreach (var eqDto in dto.Equipments ?? Enumerable.Empty<EquipmentDto>())
            {
                centralLocation.AddEquipment(new Equipment(eqDto.Id));
            }

            centralLocation.Initialize();
            _locations.Add(centralLocation);

            var response = _locations.SelectMany(loc => loc.Equipments)
                                     .Select(e => new { e.Id })
                                     .ToList();

            return Ok(new
            {
                message = "Central Location created",
                equipments = response
            });
        }

        // --------------------
        // GET: Role-based equipment view
        // --------------------
        [HttpGet]
        public IActionResult GetAllEquipments()
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role))
                return Forbid();

            var equipments = _locations.SelectMany(loc => loc.Equipments);

            if (role == Role.Admin)
            {
                return Ok(equipments.Select(e => new { e.Id }));
            }

            if (role == Role.Supervisor)
            {
                return Ok(equipments.Select(e => new
                {
                    e.Id,
                    HistProductionStates = e.HistProductionStates,
                    CurrentOrderId = e.CurrentOrder?.Id,
                    // Current state within the active order's sequence
                    CurrentOrderState = e.CurrentOrder?.CurrentState.ToString(),
                    // Index within the sequence (0–4) so frontend can visualize progress
                    CurrentOrderStateIndex = e.CurrentOrder?.CurrentStateIndex,
                    TotalOrderCount = e.Orders.Count,
                    CompletedOrderCount = e.Orders.Count(o => o.IsComplete)
                }));
            }

            if (role == Role.Worker)
            {
                return Ok(equipments.Select(e => new
                {
                    e.Id,
                    CurrentProductionState = e.CurrentProductionState.ToString(),
                    CurrentOrderId = e.CurrentOrder?.Id,
                    ScheduledOrders = e.Orders.Select(o => o.Id).ToList(),
                    HistProductionStates = e.HistProductionStates,
                    // The one state the Worker must set next — null if no active order
                    NextExpectedState = e.NextExpectedState?.ToString()
                }));
            }

            return Forbid();
        }

        // --------------------
        // PUT: Worker records a state — must match the expected next state
        // --------------------
        [HttpPut("record/{equipmentId}")]
        public IActionResult RecordState(int equipmentId, [FromBody] RecordStateDto dto)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Worker)
                return Forbid();

            var equipment = _locations.SelectMany(loc => loc.Equipments)
                                      .FirstOrDefault(e => e.Id == equipmentId);
            if (equipment == null) return NotFound();

            if (!Enum.TryParse<ProductionState>(dto.State, out var newState))
                return BadRequest("Invalid production state.");

            bool accepted = equipment.RecordState(newState);

            if (!accepted)
                return BadRequest($"Invalid state transition. Expected: {equipment.NextExpectedState?.ToString() ?? "none"}.");

            return Ok(new
            {
                equipment.Id,
                CurrentOrderId = equipment.CurrentOrder?.Id,
                CurrentProductionState = equipment.CurrentProductionState.ToString(),
                HistProductionStates = equipment.HistProductionStates,
                NextExpectedState = equipment.NextExpectedState?.ToString()
            });
        }

        // --------------------
        // PUT: Supervisor schedules orders — can be called multiple times
        // --------------------
        [HttpPut("schedule/{equipmentId}")]
        public IActionResult ScheduleOrders(int equipmentId, [FromBody] ScheduleOrdersDto dto)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Supervisor)
                return Forbid();

            var equipment = _locations.SelectMany(loc => loc.Equipments)
                                      .FirstOrDefault(e => e.Id == equipmentId);
            if (equipment == null) return NotFound();

            if (dto.NumberOfOrders < 1)
                return BadRequest("Number of orders must be at least 1.");

            // Generate order IDs that are unique across ALL equipments globally
            int nextId = _locations.SelectMany(loc => loc.Equipments)
                                   .SelectMany(e => e.Orders)
                                   .Select(o => o.Id)
                                   .DefaultIfEmpty(0)
                                   .Max() + 1;

            var newOrders = Enumerable.Range(nextId, dto.NumberOfOrders)
                                      .Select(i => new Order
                                      {
                                          Id = i,
                                          EquipmentId = equipmentId
                                          // RequiredSequence is static on Order — no need to assign
                                      }).ToList();

            equipment.ScheduleOrders(newOrders);

            return Ok(new
            {
                equipment.Id,
                ScheduledOrders = equipment.Orders.Select(o => o.Id),
                TotalOrders = equipment.Orders.Count
            });
        }
    }
}