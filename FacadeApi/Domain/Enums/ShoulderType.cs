using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShoulderType
    {
        Inclined = 0,
        Straight = 1,
        Other = 2
    }
}
