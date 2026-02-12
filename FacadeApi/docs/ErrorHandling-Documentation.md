# Error Handling System - Documentación Completa

## Descripción
Sistema de manejo de errores centralizado y estandarizado para toda la aplicación, proporcionando códigos de error consistentes, mensajes en español y respuestas estructuradas.

## Componentes del Sistema

### 1. ErrorCodes (Códigos Estandarizados)

Ubicación: `Application/Common/Errors/ErrorCodes.cs`

Constantes estáticas con códigos de error únicos organizados por categoría:

```csharp
// General (1000-1099)
ERR_1000 - Error general
ERR_1001 - Error interno del servidor
ERR_1002 - Error de validación
ERR_1003 - No autorizado
ERR_1004 - Prohibido
ERR_1005 - Bad request

// Products (2000-2099)
ERR_2000 - Producto no encontrado
ERR_2001 - Producto ya existe
ERR_2002 - Precio inválido
ERR_2003 - Nombre inválido
ERR_2004 - Error al crear
ERR_2005 - Error al actualizar
ERR_2006 - Error al eliminar

// Brands (2100-2199)
ERR_2100 - Marca no encontrada
ERR_2101 - Marca ya existe

// Categories (2200-2299)
ERR_2200 - Categoría no encontrada
ERR_2201 - Categoría ya existe

// Sizes (2300-2399)
ERR_2300 - Talla no encontrada
ERR_2301 - Talla inválida

// Database (3000-3099)
ERR_3000 - Error de base de datos
ERR_3001 - Fallo de conexión
ERR_3002 - Violación de restricción

// External Services (4000-4099)
ERR_4000 - Error servicio externo
ERR_4001 - API externa no disponible
```

### 2. ErrorMessages (Mensajes Centralizados)

Ubicación: `Application/Common/Errors/ErrorMessages.cs`

Diccionario con mensajes en español para cada código de error:

```csharp
public static string Get(string errorCode)
{
    return Messages.TryGetValue(errorCode, out var message) 
        ? message 
        : "Error desconocido";
}

// Con parámetros
public static string Get(string errorCode, params object[] args)
{
    var message = Get(errorCode);
    return string.Format(message, args);
}
```

**Uso:**
```csharp
var message = ErrorMessages.Get(ErrorCodes.PRODUCT_NOT_FOUND);
// "Producto no encontrado"

var messageWithParam = ErrorMessages.Get(ErrorCodes.PRODUCT_NOT_FOUND, productId);
// Formato personalizado si necesitas
```

### 3. ApiErrorResponse

Ubicación: `Application/Common/Errors/ApiErrorResponse.cs`

Estructura de respuesta de error:

```csharp
public class ApiErrorResponse
{
    public int HttpCode { get; set; }
    public string ErrorCode { get; set; }
    public string ErrorDescription { get; set; }
    public List<string>? ValidationErrors { get; set; }
    public DateTime Timestamp { get; set; }
}
```

**Constructores:**
```csharp
// Con código HTTP y error code (mensaje automático)
new ApiErrorResponse(HttpStatusCode.NotFound, ErrorCodes.PRODUCT_NOT_FOUND)

// Con mensaje personalizado
new ApiErrorResponse(HttpStatusCode.BadRequest, ErrorCodes.VALIDATION_ERROR, "Custom message")

// Con errores de validación
new ApiErrorResponse(404, ErrorCodes.PRODUCT_NOT_FOUND)
    .WithValidationErrors(errors)
```

### 4. ApiErrorException

Ubicación: `Application/Common/Errors/ApiErrorException.cs`

Excepción personalizada que envuelve ApiErrorResponse:

```csharp
// Constructor básico
throw new ApiErrorException(HttpStatusCode.NotFound, ErrorCodes.PRODUCT_NOT_FOUND);

// Con mensaje personalizado
throw new ApiErrorException(HttpStatusCode.NotFound, ErrorCodes.PRODUCT_NOT_FOUND, 
    "Product with ID 123 not found");

// Con errores de validación
throw new ApiErrorException(HttpStatusCode.BadRequest, ErrorCodes.VALIDATION_ERROR, 
    validationErrors);
```

**Métodos Helper:**
```csharp
// Not Found (404)
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND);
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, "Custom message");

// Bad Request (400)
throw ApiErrorException.BadRequest(ErrorCodes.VALIDATION_ERROR);
throw ApiErrorException.BadRequest(ErrorCodes.VALIDATION_ERROR, "Custom message");
throw ApiErrorException.BadRequest(ErrorCodes.VALIDATION_ERROR, validationErrors);

// Conflict (409)
throw ApiErrorException.Conflict(ErrorCodes.PRODUCT_ALREADY_EXISTS);

// Internal Server Error (500)
throw ApiErrorException.InternalServerError(ErrorCodes.INTERNAL_SERVER_ERROR);
```

### 5. ErrorHandlingMiddleware

Ubicación: `FacadeApi/Middleware/ErrorHandlingMiddleware.cs`

Middleware global que captura todas las excepciones:

```csharp
public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context);
    }
    catch (ApiErrorException ex)
    {
        // Maneja excepciones personalizadas
        await HandleApiErrorException(context, ex);
    }
    catch (Exception ex)
    {
        // Maneja excepciones no controladas
        await HandleUnhandledException(context, ex);
    }
}
```

**Registrado en Program.cs:**
```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

## Uso en la Aplicación

### En Services

```csharp
public async Task<ProductDto?> GetProductByIdAsync(int id)
{
    var product = await _productRepository.GetByIdAsync(id);
    
    if (product == null)
        throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
            $"Product with ID {id} not found");

    return product;
}

public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
{
    try
    {
        return await _productRepository.CreateAsync(createDto);
    }
    catch (Exception ex)
    {
        throw ApiErrorException.InternalServerError(ErrorCodes.PRODUCT_CREATE_FAILED, 
            $"Failed to create product: {ex.Message}");
    }
}
```

### En Controllers (Simplificado)

```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    // El middleware captura la excepción automáticamente
    var product = await _productService.GetProductByIdAsync(id);
    return Ok(ApiResponse<ProductDto>.Ok(product, "Product retrieved successfully"));
}

[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    // No necesitas if (!result) return NotFound()
    await _productService.DeleteProductAsync(id);
    return Ok(ApiResponseNoData.Ok("Product deleted successfully"));
}
```

## Respuestas del Middleware

### Error Personalizado (ApiErrorException)

**Request:**
```
GET /api/products/999
```

**Response (404):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": {
    "errorCode": "ERR_2000",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

### Error de Validación

**Request:**
```
POST /api/products
{
  "name": "",
  "price": -10
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Error de validación en los datos proporcionados",
  "data": {
    "errorCode": "ERR_1002",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "errors": [
    "Name is required",
    "Price must be greater than 0"
  ]
}
```

### Error Interno del Servidor

**Request:**
```
GET /api/products/1
```

**Response (500):**
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "data": {
    "errorCode": "ERR_1001",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "errors": null
}
```

## Ventajas del Sistema

### ✅ Centralización
- Todos los códigos de error en un solo lugar
- Mensajes consistentes en toda la aplicación
- Fácil de mantener y actualizar

### ✅ Estandarización
- Formato uniforme de respuestas de error
- Códigos de error numéricos únicos
- HTTP Status Codes apropiados

### ✅ Internacionalización Preparada
```csharp
// Actual: español
ErrorMessages.Get(ErrorCodes.PRODUCT_NOT_FOUND)
// "Producto no encontrado"

// Futuro: inglés
ErrorMessages.GetInEnglish(ErrorCodes.PRODUCT_NOT_FOUND)
// "Product not found"
```

### ✅ Logging Mejorado
```csharp
_logger.LogWarning(ex, "API Error: {ErrorCode} - {Message}", 
    ex.ErrorResponse.ErrorCode, ex.Message);
```

### ✅ Frontend Friendly
```typescript
if (response.data.errorCode === 'ERR_2000') {
  showNotFoundModal();
} else if (response.data.errorCode === 'ERR_1002') {
  showValidationErrors(response.errors);
}
```

### ✅ Debugging Simplificado
- Timestamp en cada error
- Error code único para búsquedas
- Stack trace en logs del servidor

## Agregar Nuevos Errores

### Paso 1: Agregar código en ErrorCodes.cs
```csharp
public const string ORDER_NOT_FOUND = "ERR_5000";
public const string ORDER_ALREADY_PROCESSED = "ERR_5001";
```

### Paso 2: Agregar mensaje en ErrorMessages.cs
```csharp
{ ErrorCodes.ORDER_NOT_FOUND, "Orden no encontrada" },
{ ErrorCodes.ORDER_ALREADY_PROCESSED, "La orden ya fue procesada" },
```

### Paso 3: Usar en el código
```csharp
if (order == null)
    throw ApiErrorException.NotFound(ErrorCodes.ORDER_NOT_FOUND, 
        $"Order with ID {orderId} not found");
```

## Categorías de Códigos de Error

| Rango | Categoría | Ejemplos |
|-------|-----------|----------|
| 1000-1099 | General | Validación, autenticación, errores genéricos |
| 2000-2099 | Products | CRUD de productos |
| 2100-2199 | Brands | CRUD de marcas |
| 2200-2299 | Categories | CRUD de categorías |
| 2300-2399 | Sizes | Tallas y medidas |
| 3000-3099 | Database | Errores de BD, conexión, constraints |
| 4000-4099 | External Services | APIs externas, servicios de terceros |
| 5000-5999 | **Disponible para nuevos módulos** |

## Testing

### Unit Test de ErrorMessages
```csharp
[TestMethod]
public void ErrorMessages_Get_ReturnsCorrectMessage()
{
    // Act
    var message = ErrorMessages.Get(ErrorCodes.PRODUCT_NOT_FOUND);

    // Assert
    Assert.AreEqual("Producto no encontrado", message);
}
```

### Integration Test de Middleware
```csharp
[TestMethod]
public async Task GetById_NotFound_ReturnsStructuredError()
{
    // Act
    var response = await _client.GetAsync("/api/products/999");
    var content = await response.Content.ReadAsStringAsync();
    var result = JsonSerializer.Deserialize<ApiResponse<object>>(content);

    // Assert
    Assert.AreEqual(404, (int)response.StatusCode);
    Assert.IsFalse(result.Success);
    Assert.AreEqual("ERR_2000", ((JsonElement)result.Data).GetProperty("errorCode").GetString());
}
```

## Best Practices

### ✅ DO

1. **Usar códigos específicos:**
```csharp
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND);
```

2. **Agregar contexto en mensajes:**
```csharp
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
    $"Product with ID {id} not found");
```

3. **Wrap excepciones de terceros:**
```csharp
try
{
    await _externalApi.CallAsync();
}
catch (Exception ex)
{
    throw ApiErrorException.InternalServerError(
        ErrorCodes.EXTERNAL_API_UNAVAILABLE, 
        $"Failed to call external API: {ex.Message}");
}
```

### ❌ DON'T

1. **No usar strings mágicos:**
```csharp
// ❌ Malo
throw new Exception("Product not found");

// ✅ Bueno
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND);
```

2. **No ignorar excepciones:**
```csharp
// ❌ Malo
catch (Exception ex) { }

// ✅ Bueno
catch (Exception ex)
{
    throw ApiErrorException.InternalServerError(
        ErrorCodes.INTERNAL_SERVER_ERROR, 
        ex.Message);
}
```

3. **No exponer detalles sensibles:**
```csharp
// ❌ Malo
throw ApiErrorException.InternalServerError(
    ErrorCodes.DATABASE_ERROR, 
    $"Connection string: {connectionString}");

// ✅ Bueno
throw ApiErrorException.InternalServerError(
    ErrorCodes.DATABASE_CONNECTION_FAILED, 
    "Failed to connect to database");
```

## Monitoreo y Logs

El middleware automáticamente loguea:

```csharp
// Errores personalizados (Warning)
_logger.LogWarning(ex, "API Error: {ErrorCode} - {Message}", 
    ex.ErrorResponse.ErrorCode, ex.Message);

// Errores no controlados (Error)
_logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
```

**Formato de log:**
```
[WARN] API Error: ERR_2000 - Product with ID 999 not found
[ERROR] Unhandled exception: Object reference not set to an instance of an object
```

## Resumen

| Componente | Propósito | Ubicación |
|------------|-----------|-----------|
| **ErrorCodes** | Códigos únicos | Application/Common/Errors |
| **ErrorMessages** | Mensajes en español | Application/Common/Errors |
| **ApiErrorResponse** | Estructura de error | Application/Common/Errors |
| **ApiErrorException** | Excepción custom | Application/Common/Errors |
| **ErrorHandlingMiddleware** | Captura global | FacadeApi/Middleware |

¡Sistema de manejo de errores completo y listo para producción! 🚀
