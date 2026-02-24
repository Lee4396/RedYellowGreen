namespace backend.Models
{
    public class Equipment
    {
        public int Id { get; set; }
        public ProductionState ProductionState { get; set; } = ProductionState.Red;

        public Equipment(int id)
        {
            Id = id;
        }
    }
}