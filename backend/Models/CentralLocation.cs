namespace backend.Models
{
    public class CentralLocation
    {
        private readonly List<Equipment> _equipments = new();

        public IReadOnlyCollection<Equipment> Equipments => _equipments;

        public void Initialize()
        {
            if (_equipments.Count == 0)
            {
                _equipments.Add(new Equipment { Id = 1 });
            }
        }

        public void AddEquipment(Equipment equipment)
        {
            _equipments.Add(equipment);
        }
    }
}