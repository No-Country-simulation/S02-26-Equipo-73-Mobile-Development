using System.Text.Json.Serialization;

namespace Application.DTOs.Products
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ProductSortBy
    {
        Id,
        Name,
        Price,
        Brand
    }
}
