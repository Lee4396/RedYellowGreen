namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; }
        public List<ProductionState> ProductionStates { get; set; } = new();
    }
}