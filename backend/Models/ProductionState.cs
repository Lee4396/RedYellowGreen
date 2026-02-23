using System.ComponentModel;

namespace backend.Models
{
    public enum ProductionState
    {
        [Description("standing still")]
        Red,
        [Description("starting up/winding down")]
        Yellow,
        [Description("producing normally")]
        Green
    }
}