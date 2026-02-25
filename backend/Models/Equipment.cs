namespace backend.Models
{
    public class Equipment
    {
        public int Id { get; set; }

        public ProductionState CurrentProductionState { get; set; } = ProductionState.Red;

        public List<Order> Orders { get; set; } = new();

        // History of all distinct production states recorded across all orders
        public List<ProductionState> HistProductionStates { get; set; } = new() { ProductionState.Red };

        public Order? CurrentOrder { get; private set; }

        // The next state the Worker must set — derived from the current order's sequence
        // Returns null if there is no active order or the order is complete
        public ProductionState? NextExpectedState => CurrentOrder?.NextExpectedState;

        public Equipment(int id)
        {
            Id = id;
        }

        public void ScheduleOrders(List<Order> orders)
        {
            if (orders == null || orders.Count == 0) return;

            Orders.AddRange(orders);

            // Only set CurrentOrder if there isn't one already active
            if (CurrentOrder == null)
            {
                CurrentOrder = Orders.FirstOrDefault(o => !o.IsComplete);
                CurrentProductionState = ProductionState.Red;
            }
        }

        // Returns false if the state does not match the expected next state
        public bool RecordState(ProductionState newState)
        {
            // If there is an active order, enforce the sequence
            if (CurrentOrder != null)
            {
                var expected = CurrentOrder.NextExpectedState;

                // If order is already complete or state doesn't match sequence, reject
                if (expected == null || newState != expected)
                {
                    return false;
                }

                // Advance the order's position in the sequence
                CurrentOrder.AdvanceState();
            }

            // Add to history only if different from the last recorded state
            if (HistProductionStates.Last() != newState)
            {
                HistProductionStates.Add(newState);
            }

            CurrentProductionState = newState;

            // Check if current order is now complete
            if (CurrentOrder != null && CurrentOrder.IsComplete)
            {
                MoveToNextOrder();
            }

            return true;
        }

        private void MoveToNextOrder()
        {
            // Find the next incomplete order
            var nextOrder = Orders
                .SkipWhile(o => o != CurrentOrder)
                .Skip(1)
                .FirstOrDefault(o => !o.IsComplete);

            CurrentOrder = nextOrder;

            if (CurrentOrder != null)
            {
                // Next order always starts at Red
                CurrentProductionState = ProductionState.Red;
            }
        }
    }
}