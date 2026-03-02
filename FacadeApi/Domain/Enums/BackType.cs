using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BackType
    {
        Straight = 0,
        Concave = 1,
        Convex = 2,
        Other = 3
    }
}
