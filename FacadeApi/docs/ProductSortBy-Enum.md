# ProductSortBy Enum

## Descripción
Enum utilizado para especificar el campo por el cual ordenar los productos en la API.

## Valores

| Valor | Descripción |
|-------|-------------|
| `Id` | Ordena por el ID del producto (default) |
| `Name` | Ordena por el nombre del producto alfabéticamente |
| `Price` | Ordena por el precio del producto |
| `Brand` | Ordena por el nombre de la marca |

## Uso en API

El enum se serializa como **string** en JSON gracias al `JsonStringEnumConverter`, lo que permite usar los valores en las peticiones HTTP de forma legible.

### Ejemplos:

```http
# Ordenar por nombre (ascendente)
GET /api/products?sortBy=Name

# Ordenar por precio (descendente)
GET /api/products?sortBy=Price&sortDescending=true

# Ordenar por marca
GET /api/products?sortBy=Brand

# Sin especificar (default: Id)
GET /api/products
```

## Swagger/OpenAPI

En la documentación de Swagger/OpenAPI, este enum aparece como un **dropdown** con las opciones disponibles:
- Id
- Name
- Price
- Brand

Esto facilita el uso de la API ya que los desarrolladores pueden ver directamente las opciones válidas sin necesidad de consultar documentación adicional.

## Implementación técnica

### Definición del Enum:
```csharp
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProductSortBy
{
    Id,
    Name,
    Price,
    Brand
}
```

### Configuración Global:
En `Program.cs`:
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
```

### Uso en DTO:
```csharp
public class ProductFilterDto
{
    public ProductSortBy? SortBy { get; set; }
    // ...
}
```

### Uso en Repository:
```csharp
query = filter.SortBy switch
{
    ProductSortBy.Name => filter.SortDescending 
        ? query.OrderByDescending(p => p.Name) 
        : query.OrderBy(p => p.Name),
    ProductSortBy.Price => filter.SortDescending 
        ? query.OrderByDescending(p => p.Price) 
        : query.OrderBy(p => p.Price),
    ProductSortBy.Brand => filter.SortDescending 
        ? query.OrderByDescending(p => p.Brand.Name) 
        : query.OrderBy(p => p.Brand.Name),
    _ => query.OrderBy(p => p.Id)
};
```

## Ventajas

- **Type-safe**: Previene errores de tipeo en strings  
- **IntelliSense**: Autocompletado en el IDE  
- **Documentación automática**: Visible en Swagger/OpenAPI  
- **Case-insensitive**: El JsonConverter maneja mayúsculas/minúsculas  
- **Extensible**: Fácil agregar nuevos campos de ordenamiento  

## Agregar nuevos campos de ordenamiento

Para agregar un nuevo campo (ejemplo: `Category`):

1. Agregar valor al enum:
```csharp
public enum ProductSortBy
{
    Id,
    Name,
    Price,
    Brand,
    Category  // Nuevo
}
```

2. Actualizar el switch en el repository:
```csharp
ProductSortBy.Category => filter.SortDescending 
    ? query.OrderByDescending(p => p.Category.Name) 
    : query.OrderBy(p => p.Category.Name),
```

3. El cambio se reflejará automáticamente en Swagger/OpenAPI
