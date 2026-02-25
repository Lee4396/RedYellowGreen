namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; }

        // Fixed production sequence every order must follow: Red → Yellow → Green → Yellow → Red
        public static readonly List<ProductionState> RequiredSequence = new()
        {
            ProductionState.Red,
            ProductionState.Yellow,
            ProductionState.Green,
            ProductionState.Yellow,
            ProductionState.Red
        };

        // Tracks how far through the sequence this order has progressed
        public int CurrentStateIndex { get; set; } = 0;

        // The current state this order is at in its sequence
        public ProductionState CurrentState => RequiredSequence[CurrentStateIndex];

        // The next expected state to advance this order (null if order is complete)
        public ProductionState? NextExpectedState =>
            CurrentStateIndex < RequiredSequence.Count - 1
                ? RequiredSequence[CurrentStateIndex + 1]
                : null;

        // Whether this order has been fully completed
        public bool IsComplete => CurrentStateIndex >= RequiredSequence.Count - 1;

        // Advance the order to the next state in the sequence
        public void AdvanceState()
        {
            if (!IsComplete)
            {
                CurrentStateIndex++;
            }
        }
    }
}