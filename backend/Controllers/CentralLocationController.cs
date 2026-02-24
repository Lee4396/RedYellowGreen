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

        [HttpPost]
        public IActionResult Create([FromBody] CentralLocationDto dto)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Admin)
                return Forbid();

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
                    CurrentOrderId = e.CurrentOrder?.Id
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
                    HistProductionStates = e.HistProductionStates
                }));
            }

            return Forbid();
        }

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
                return BadRequest();

            equipment.RecordState(newState);

            return Ok(new
            {
                equipment.Id,
                CurrentOrderId = equipment.CurrentOrder?.Id,
                CurrentProductionState = equipment.CurrentProductionState,
                HistProductionStates = equipment.HistProductionStates
            });
        }

        [HttpPut("schedule/{equipmentId}")]
        public IActionResult ScheduleOrders(int equipmentId, [FromBody] ScheduleOrdersDto dto)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Supervisor)
                return Forbid();

            var equipment = _locations.SelectMany(loc => loc.Equipments)
                                      .FirstOrDefault(e => e.Id == equipmentId);
            if (equipment == null) return NotFound();

            if (equipment.Orders.Count > 0)
                return BadRequest("Orders already scheduled");

            var defaultSequence = new List<ProductionState> { ProductionState.Red, ProductionState.Yellow, ProductionState.Green, ProductionState.Yellow, ProductionState.Red };

            var orders = Enumerable.Range(1, dto.NumberOfOrders)
                                   .Select(i => new Order
                                   {
                                       Id = i,
                                       EquipmentId = equipmentId,
                                       ProductionStates = defaultSequence
                                   }).ToList();

            equipment.ScheduleOrders(orders);

            return Ok(new
            {
                equipment.Id,
                ScheduledOrders = equipment.Orders.Select(o => o.Id)
            });
        }
    }
}