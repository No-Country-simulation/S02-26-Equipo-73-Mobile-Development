# ApiResponse - Standardized API Responses

## Descripción
Sistema de respuestas estandarizadas para toda la API, proporcionando una estructura consistente y predecible para todos los endpoints.

## Clases Creadas

### 1. ApiResponse<T>
Respuesta genérica con datos tipados.

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
}
```

### 2. ApiResponseNoData
Respuesta sin datos (para operaciones como DELETE).

```csharp
public class ApiResponseNoData
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public List<string>? Errors { get; set; }
}
```

## Métodos Helper

### ApiResponse<T> Methods

#### Ok - Respuesta Exitosa
```csharp
ApiResponse<T>.Ok(data, message)
```

**Uso:**
```csharp
return Ok(ApiResponse<ProductDto>.Ok(product, "Product retrieved successfully"));
```

**Respuesta JSON:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Ariat Boot",
    "price": 199.99
  },
  "errors": null
}
```

#### NotFound - Recurso No Encontrado
```csharp
ApiResponse<T>.NotFound(message)
```

**Uso:**
```csharp
return NotFound(ApiResponse<object>.NotFound("Product not found"));
```

**Respuesta JSON:**
```json
{
  "success": false,
  "message": "Product not found",
  "data": null,
  "errors": null
}
```

#### BadRequest - Petición Inválida
```csharp
ApiResponse<T>.BadRequest(message)
ApiResponse<T>.BadRequest(message, errors)
```

**Uso:**
```csharp
return BadRequest(ApiResponse<object>.BadRequest(
    "Invalid product data", 
    new List<string> { "Name is required", "Price must be greater than 0" }
));
```

**Respuesta JSON:**
```json
{
  "success": false,
  "message": "Invalid product data",
  "data": null,
  "errors": [
    "Name is required",
    "Price must be greater than 0"
  ]
}
```

#### Fail - Error General
```csharp
ApiResponse<T>.Fail(message)
ApiResponse<T>.Fail(message, errors)
```

**Uso:**
```csharp
return BadRequest(ApiResponse<object>.Fail("Operation failed", errors));
```

### ApiResponseNoData Methods

Para operaciones sin retorno de datos:

```csharp
ApiResponseNoData.Ok("Product deleted successfully")
ApiResponseNoData.NotFound("Product not found")
ApiResponseNoData.BadRequest("Invalid request")
ApiResponseNoData.Fail("Operation failed")
```

## Ejemplos por Endpoint

### GET /api/products
**Success (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [...],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": null
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "message": "Invalid filter parameters",
  "data": null,
  "errors": [
    "PageNumber must be at least 1",
    "PageSize must be between 1 and 100"
  ]
}
```

### GET /api/products/{id}
**Success (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Ariat Heritage Boot",
    "description": "Classic paddock boot",
    "price": 179.99,
    "brandName": "Ariat",
    "categoryName": "Boots",
    "variants": [...]
  },
  "errors": null
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": null,
  "errors": null
}
```

### POST /api/products
**Success (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 16,
    "name": "New Product",
    "price": 299.99,
    ...
  },
  "errors": null
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "message": "Invalid product data",
  "data": null,
  "errors": [
    "Name is required",
    "Price must be greater than 0",
    "BrandId must be greater than 0"
  ]
}
```

### PUT /api/products/{id}
**Success (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product",
    ...
  },
  "errors": null
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": null,
  "errors": null
}
```

### DELETE /api/products/{id}
**Success (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "errors": null
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": null,
  "errors": null
}
```

## Implementación en Controller

### Antes (Sin ApiResponse):
```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    var product = await _productService.GetProductByIdAsync(id);
    
    if (product == null)
        return NotFound(new { message = "Product not found" });

    return Ok(product);
}
```

### Después (Con ApiResponse):
```csharp
[HttpGet("{id}")]
[ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
public async Task<IActionResult> GetById(int id)
{
    var product = await _productService.GetProductByIdAsync(id);
    
    if (product == null)
        return NotFound(ApiResponse<object>.NotFound($"Product with ID {id} not found"));

    return Ok(ApiResponse<ProductDto>.Ok(product, "Product retrieved successfully"));
}
```

## Manejo de Errores de Validación

```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateProductDto createDto)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList();
        
        return BadRequest(ApiResponse<object>.BadRequest("Invalid product data", errors));
    }

    var product = await _productService.CreateProductAsync(createDto);
    var response = ApiResponse<ProductDto>.Ok(product, "Product created successfully");
    
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, response);
}
```

## ProducesResponseType para Swagger

```csharp
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<PagedResult<ProductDto>>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
{
    // ...
}
```

**Beneficio**: Swagger/OpenAPI documenta automáticamente la estructura de la respuesta.

## Ventajas

### ✅ Consistencia
- Todas las respuestas siguen la misma estructura
- Fácil de consumir desde el frontend
- Predecible para los desarrolladores

### ✅ Información Clara
- `success`: Indica si la operación fue exitosa
- `message`: Mensaje descriptivo para el usuario
- `data`: Datos de la respuesta (tipados)
- `errors`: Lista de errores de validación

### ✅ Swagger/OpenAPI
- Documentación automática mejorada
- ProducesResponseType genera ejemplos
- Clientes generados automáticamente (TypeScript, C#, etc.)

### ✅ Frontend Friendly
- Fácil de manejar con TypeScript:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Uso
const response = await fetch('/api/products/1');
const result: ApiResponse<Product> = await response.json();

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.message, result.errors);
}
```

### ✅ Testing Simplificado
```csharp
[TestMethod]
public async Task GetById_ReturnsApiResponse()
{
    // Act
    var response = await _controller.GetById(1);
    var okResult = response as OkObjectResult;
    var apiResponse = okResult.Value as ApiResponse<ProductDto>;

    // Assert
    Assert.IsTrue(apiResponse.Success);
    Assert.AreEqual("Product retrieved successfully", apiResponse.Message);
    Assert.IsNotNull(apiResponse.Data);
}
```

## Casos de Uso Especiales

### Error de Servidor (500)
```csharp
try
{
    var product = await _productService.GetProductByIdAsync(id);
    return Ok(ApiResponse<ProductDto>.Ok(product));
}
catch (Exception ex)
{
    _logger.LogError(ex, "Error getting product {Id}", id);
    return StatusCode(500, ApiResponse<object>.Fail("Internal server error"));
}
```

### Operación sin retorno de datos
```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var result = await _productService.DeleteProductAsync(id);
    
    if (!result)
        return NotFound(ApiResponse<object>.NotFound("Product not found"));

    return Ok(ApiResponseNoData.Ok("Product deleted successfully"));
}
```

### Múltiples errores de validación
```csharp
var errors = new List<string>();

if (string.IsNullOrEmpty(dto.Name))
    errors.Add("Name is required");

if (dto.Price <= 0)
    errors.Add("Price must be greater than 0");

if (errors.Any())
    return BadRequest(ApiResponse<object>.BadRequest("Validation failed", errors));
```

## Estructura de Archivos

```
Application/
└── Common/
    ├── ApiResponse.cs          # Respuesta con datos
    └── ApiResponseNoData.cs    # Respuesta sin datos
```

## Resumen

| Característica | Antes | Después |
|----------------|-------|---------|
| Estructura de respuesta | ❌ Inconsistente | ✅ Estandarizada |
| Mensajes de error | ❌ Diferentes formatos | ✅ Estructura uniforme |
| Validaciones | ❌ ModelState directo | ✅ Lista de errores |
| Swagger Documentation | 🟡 Básica | ✅ Completa con tipos |
| Frontend Integration | 😐 Difícil | 😊 Fácil y predecible |
| Testing | 🟡 Aceptable | ✅ Simplificado |

¡ApiResponse implementado con éxito! 🎉

Todas las respuestas de la API ahora siguen un formato estandarizado, facilitando el consumo desde el frontend y mejorando la experiencia del desarrollador.
