namespace backend.Models
{
    public class Equipment
    {
        public int Id { get; set; }

        public ProductionState CurrentProductionState { get; set; } = ProductionState.Red;

        public List<Order> Orders { get; set; } = new();

        public List<ProductionState> HistProductionStates { get; set; } = new() { ProductionState.Red };

        public Order? CurrentOrder { get; private set; }

        // Tracks how many history entries existed when the current order started
        private int _currentOrderHistStart = 0;

        public Equipment(int id)
        {
            Id = id;
        }

        public void ScheduleOrders(List<Order> orders)
        {
            Orders = orders ?? new();
            CurrentOrder = Orders.FirstOrDefault();
            CurrentProductionState = ProductionState.Red;
            _currentOrderHistStart = HistProductionStates.Count - 1; // Red is already in history
        }

        public void RecordState(ProductionState newState)
        {
            if (HistProductionStates.Last() != newState)
            {
                HistProductionStates.Add(newState);
            }

            CurrentProductionState = newState;

            if (CurrentOrder != null)
            {
                // How many distinct states recorded since this order started
                int statesRecordedForOrder = HistProductionStates.Count - _currentOrderHistStart;

                if (statesRecordedForOrder >= CurrentOrder.ProductionStates.Count)
                {
                    MoveToNextOrder();
                }
            }
        }

        private void MoveToNextOrder()
        {
            if (Orders == null || Orders.Count == 0 || CurrentOrder == null)
            {
                CurrentOrder = null;
                return;
            }

            int currentIndex = Orders.IndexOf(CurrentOrder);

            if (currentIndex >= 0 && currentIndex < Orders.Count - 1)
            {
                CurrentOrder = Orders[currentIndex + 1];
                CurrentProductionState = ProductionState.Red;
                // Mark where in history this new order starts
                _currentOrderHistStart = HistProductionStates.Count - 1;
            }
            else
            {
                CurrentOrder = null;
            }
        }
    }
}