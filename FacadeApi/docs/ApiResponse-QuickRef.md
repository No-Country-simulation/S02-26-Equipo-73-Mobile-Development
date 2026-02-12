# 🎯 ApiResponse - Quick Reference

## 📦 Estructura Básica

### ApiResponse<T>
```json
{
  "success": true|false,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "errors": ["error1", "error2"]
}
```

### ApiResponseNoData
```json
{
  "success": true|false,
  "message": "Mensaje descriptivo",
  "errors": ["error1", "error2"]
}
```

## 🎨 Métodos Helper

| Método | Uso | Status Code |
|--------|-----|-------------|
| `Ok(data, message)` | ✅ Operación exitosa | 200 |
| `NotFound(message)` | ❌ Recurso no encontrado | 404 |
| `BadRequest(message)` | ❌ Petición inválida | 400 |
| `BadRequest(message, errors)` | ❌ Con errores de validación | 400 |
| `Fail(message)` | ❌ Error general | Variable |
| `Fail(message, errors)` | ❌ Error con detalles | Variable |

## 📋 Ejemplos por Endpoint

### GET /api/products

#### ✅ Success (200)
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [...],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10
  },
  "errors": null
}
```

#### ❌ Bad Request (400)
```json
{
  "success": false,
  "message": "Invalid filter parameters",
  "data": null,
  "errors": ["PageNumber must be at least 1"]
}
```

---

### GET /api/products/{id}

#### ✅ Success (200)
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

#### ❌ Not Found (404)
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": null,
  "errors": null
}
```

---

### POST /api/products

#### ✅ Success (201)
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 16,
    "name": "New Product",
    "price": 299.99
  },
  "errors": null
}
```

#### ❌ Bad Request (400)
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

---

### PUT /api/products/{id}

#### ✅ Success (200)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { "id": 1, "name": "Updated" },
  "errors": null
}
```

#### ❌ Not Found (404)
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "data": null,
  "errors": null
}
```

---

### DELETE /api/products/{id}

#### ✅ Success (200)
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "errors": null
}
```

#### ❌ Not Found (404)
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "errors": null
}
```

## 💻 Uso en Controller

### Patrón Común

```csharp
// ✅ Success
return Ok(ApiResponse<ProductDto>.Ok(product, "Success message"));

// ❌ Not Found
return NotFound(ApiResponse<object>.NotFound("Not found message"));

// ❌ Bad Request (simple)
return BadRequest(ApiResponse<object>.BadRequest("Error message"));

// ❌ Bad Request (con errores)
var errors = ModelState.Values
    .SelectMany(v => v.Errors)
    .Select(e => e.ErrorMessage)
    .ToList();
return BadRequest(ApiResponse<object>.BadRequest("Validation failed", errors));
```

## 🔧 ProducesResponseType

```csharp
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<PagedResult<ProductDto>>), 200)]
[ProducesResponseType(typeof(ApiResponse<object>), 400)]
public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
{
    // ...
}
```

## 🌐 Frontend Integration

### TypeScript
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
  console.log('✅', result.data);
} else {
  console.error('❌', result.message, result.errors);
}
```

### JavaScript (React)
```javascript
const { data, error } = await fetch('/api/products')
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.message };
  });
```

## ✅ Ventajas

| Ventaja | Descripción |
|---------|-------------|
| 🎯 **Consistencia** | Todas las respuestas siguen el mismo formato |
| 📝 **Documentación** | Swagger genera docs automáticas completas |
| 🧪 **Testing** | Fácil verificar estructura de respuestas |
| 🌍 **Frontend** | Predecible y fácil de consumir |
| 🔍 **Debugging** | Mensajes claros de error |
| 📊 **Errors** | Lista estructurada de errores de validación |

## 📊 Comparación

### Antes
```json
// Success
{ "id": 1, "name": "Product" }

// Error
{ "message": "Not found" }
```

### Después
```json
// Success
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": { "id": 1, "name": "Product" },
  "errors": null
}

// Error
{
  "success": false,
  "message": "Product not found",
  "data": null,
  "errors": null
}
```

## 🚀 Casos de Uso

### Success con datos
```csharp
var product = await _service.GetByIdAsync(id);
return Ok(ApiResponse<ProductDto>.Ok(product, "Product found"));
```

### Success sin datos
```csharp
await _service.DeleteAsync(id);
return Ok(ApiResponseNoData.Ok("Product deleted"));
```

### Not Found
```csharp
if (product == null)
    return NotFound(ApiResponse<object>.NotFound("Product not found"));
```

### Bad Request con validaciones
```csharp
if (!ModelState.IsValid)
{
    var errors = ModelState.Values
        .SelectMany(v => v.Errors)
        .Select(e => e.ErrorMessage)
        .ToList();
    return BadRequest(ApiResponse<object>.BadRequest("Invalid data", errors));
}
```

### Error de servidor
```csharp
try
{
    var result = await _service.ProcessAsync();
    return Ok(ApiResponse<ResultDto>.Ok(result));
}
catch (Exception ex)
{
    _logger.LogError(ex, "Error processing");
    return StatusCode(500, ApiResponse<object>.Fail("Server error"));
}
```

## 📁 Archivos

```
Application/Common/
├── ApiResponse.cs          # Con datos tipados
└── ApiResponseNoData.cs    # Sin datos

FacadeApi/Controllers/
└── ProductsController.cs   # Implementación
```

## 🎉 Resultado

✅ **Estandarización completa**: Todas las respuestas son predecibles
✅ **Swagger mejorado**: Documentación automática detallada  
✅ **Frontend-friendly**: Fácil integración con cualquier framework
✅ **Validaciones claras**: Lista de errores estructurada
✅ **Type-safe**: Tipado fuerte en C# y TypeScript

¡ApiResponse implementado exitosamente! 🚀
