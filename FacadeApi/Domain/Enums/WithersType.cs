using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum WithersType
    {
        Prominent = 0,
        Medium = 1,
        Flat = 2,
        Other = 3
    }
}
