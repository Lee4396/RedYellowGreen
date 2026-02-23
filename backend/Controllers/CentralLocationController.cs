using Microsoft.AspNetCore.Mvc;
using backend.Models;
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

            var centralLocation = new CentralLocation();

            foreach (var eqDto in dto.Equipments ?? Enumerable.Empty<EquipmentDto>())
            {
                centralLocation.AddEquipment(new Equipment
                {
                    Id = eqDto.Id
                    // ProductionState defaults to Red
                });
            }

            centralLocation.Initialize();
            _locations.Add(centralLocation);

            // Admin sees IDs only
            var response = centralLocation.Equipments
                .Select(e => new
                {
                    e.Id
                })
                .ToList();

            return Ok(new
            {
                message = "Central Location created",
                equipments = response
            });
        }

        // --------------------
        // GET: Worker sees state, Admin sees IDs only
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

            if (role == Role.Worker)
            {
                return Ok(equipments.Select(e => new
                {
                    e.Id,
                    ProductionState = e.ProductionState.ToString(),
                    ProductionStateDescription = EnumHelper.GetDescription(e.ProductionState)
                }));
            }

            return Forbid();
        }

        // --------------------
        // PUT: Worker batch update states
        // --------------------
        [HttpPut("batch")]
        public IActionResult UpdateBatch([FromBody] List<UpdateEquipmentDto> updates)
        {
            var roleHeader = Request.Headers["Role"].FirstOrDefault();
            if (!Enum.TryParse<Role>(roleHeader, out var role) || role != Role.Worker)
                return Forbid();

            if (updates == null || !updates.Any())
                return BadRequest("No updates provided");

            foreach (var update in updates)
            {
                var equipment = _locations
                    .SelectMany(loc => loc.Equipments)
                    .FirstOrDefault(e => e.Id == update.Id);

                if (equipment == null) continue;

                if (!Enum.TryParse<ProductionState>(update.ProductionState, out var newState))
                    continue;

                equipment.ProductionState = newState;
            }

            var allEquipments = _locations
                .SelectMany(loc => loc.Equipments)
                .Select(e => new
                {
                    e.Id,
                    ProductionState = e.ProductionState.ToString(),
                    ProductionStateDescription = EnumHelper.GetDescription(e.ProductionState)
                })
                .ToList();

            return Ok(allEquipments);
        }
    }

    // --------------------
    // DTOs
    // --------------------
    public class CentralLocationDto
    {
        public List<EquipmentDto> Equipments { get; set; } = new();
    }

    public class EquipmentDto
    {
        public int Id { get; set; }
    }

    public class UpdateEquipmentDto
    {
        public int Id { get; set; }
        public string ProductionState { get; set; } = string.Empty;
    }
}