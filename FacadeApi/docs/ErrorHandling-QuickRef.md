# 🛡️ Error Handling - Quick Reference

## 🎯 Sistema Centralizado

```
ErrorCodes → ErrorMessages → ApiErrorException → Middleware → ApiResponse
```

## 📋 Códigos de Error

| Código | Categoría | Mensaje |
|--------|-----------|---------|
| **General (1000-1099)** |
| ERR_1000 | General | Error inesperado |
| ERR_1001 | Server | Error interno del servidor |
| ERR_1002 | Validation | Error de validación |
| ERR_1003 | Auth | No autorizado |
| ERR_1004 | Auth | Acceso prohibido |
| ERR_1005 | Request | Bad request |
| **Products (2000-2099)** |
| ERR_2000 | Not Found | Producto no encontrado |
| ERR_2001 | Conflict | Producto ya existe |
| ERR_2002 | Validation | Precio inválido |
| ERR_2003 | Validation | Nombre inválido |
| ERR_2004 | Operation | Error al crear |
| ERR_2005 | Operation | Error al actualizar |
| ERR_2006 | Operation | Error al eliminar |
| **Brands (2100-2199)** |
| ERR_2100 | Not Found | Marca no encontrada |
| ERR_2101 | Conflict | Marca ya existe |
| **Categories (2200-2299)** |
| ERR_2200 | Not Found | Categoría no encontrada |
| ERR_2201 | Conflict | Categoría ya existe |
| **Sizes (2300-2399)** |
| ERR_2300 | Not Found | Talla no encontrada |
| ERR_2301 | Validation | Talla inválida |
| **Database (3000-3099)** |
| ERR_3000 | Database | Error de BD |
| ERR_3001 | Connection | Fallo de conexión |
| ERR_3002 | Constraint | Violación de restricción |
| **External (4000-4099)** |
| ERR_4000 | Service | Error servicio externo |
| ERR_4001 | API | API externa no disponible |

## 🚀 Uso Rápido

### Lanzar Excepciones

```csharp
// Not Found (404)
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND);
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, "Custom message");

// Bad Request (400)
throw ApiErrorException.BadRequest(ErrorCodes.VALIDATION_ERROR);
throw ApiErrorException.BadRequest(ErrorCodes.VALIDATION_ERROR, validationErrors);

// Conflict (409)
throw ApiErrorException.Conflict(ErrorCodes.PRODUCT_ALREADY_EXISTS);

// Internal Server Error (500)
throw ApiErrorException.InternalServerError(ErrorCodes.PRODUCT_CREATE_FAILED);
```

### En Services

```csharp
public async Task<ProductDto?> GetProductByIdAsync(int id)
{
    var product = await _repository.GetByIdAsync(id);
    
    if (product == null)
        throw ApiErrorException.NotFound(
            ErrorCodes.PRODUCT_NOT_FOUND, 
            $"Product {id} not found");

    return product;
}
```

### En Controllers

```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    // El middleware captura automáticamente
    var product = await _service.GetProductByIdAsync(id);
    return Ok(ApiResponse<ProductDto>.Ok(product));
}
```

## 📦 Respuestas del Middleware

### Error Personalizado

**Request:** `GET /api/products/999`

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

**Request:** `POST /api/products` (datos inválidos)

**Response (400):**
```json
{
  "success": false,
  "message": "Error de validación",
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

### Error del Servidor

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

## 🛠️ Agregar Nuevos Errores

### 1. ErrorCodes.cs
```csharp
public const string NEW_ERROR = "ERR_5000";
```

### 2. ErrorMessages.cs
```csharp
{ ErrorCodes.NEW_ERROR, "Mensaje del error" }
```

### 3. Usar
```csharp
throw ApiErrorException.NotFound(ErrorCodes.NEW_ERROR);
```

## 🎨 Patrones Comunes

### Not Found
```csharp
if (entity == null)
    throw ApiErrorException.NotFound(ErrorCodes.ENTITY_NOT_FOUND, 
        $"Entity {id} not found");
```

### Validation
```csharp
if (dto.Price <= 0)
    throw ApiErrorException.BadRequest(ErrorCodes.PRODUCT_INVALID_PRICE, 
        "Price must be greater than 0");
```

### Database Error
```csharp
try
{
    await _context.SaveChangesAsync();
}
catch (DbUpdateException ex)
{
    throw ApiErrorException.InternalServerError(ErrorCodes.DATABASE_ERROR, 
        "Failed to save changes");
}
```

### External API
```csharp
try
{
    await _httpClient.GetAsync(url);
}
catch (HttpRequestException ex)
{
    throw ApiErrorException.InternalServerError(ErrorCodes.EXTERNAL_API_UNAVAILABLE, 
        "External service is unavailable");
}
```

## 🔍 Frontend Integration

### TypeScript
```typescript
interface ErrorData {
  errorCode: string;
  timestamp: string;
}

interface ApiError {
  success: false;
  message: string;
  data: ErrorData;
  errors?: string[];
}

// Manejo de errores
if (!response.success) {
  const error = response as ApiError;
  
  switch (error.data.errorCode) {
    case 'ERR_2000':
      showNotFoundModal();
      break;
    case 'ERR_1002':
      showValidationErrors(error.errors);
      break;
    default:
      showGenericError(error.message);
  }
}
```

### React Hook
```typescript
function useErrorHandler() {
  const handleError = (error: ApiError) => {
    switch (error.data.errorCode) {
      case 'ERR_2000':
        toast.error('Resource not found');
        break;
      case 'ERR_1002':
        toast.error('Validation failed');
        break;
      case 'ERR_1001':
        toast.error('Server error, please try again');
        break;
      default:
        toast.error(error.message);
    }
  };

  return { handleError };
}
```

## 📊 Rangos de Códigos

| Rango | Categoría | Disponibilidad |
|-------|-----------|----------------|
| 1000-1099 | General | ✅ Definidos |
| 2000-2099 | Products | ✅ Definidos |
| 2100-2199 | Brands | ✅ Definidos |
| 2200-2299 | Categories | ✅ Definidos |
| 2300-2399 | Sizes | ✅ Definidos |
| 3000-3099 | Database | ✅ Definidos |
| 4000-4099 | External Services | ✅ Definidos |
| 5000-9999 | **Disponible para nuevos módulos** | 🆓 Libre |

## ✅ Best Practices

### ✅ DO
```csharp
// Usar códigos específicos
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND);

// Agregar contexto
throw ApiErrorException.NotFound(ErrorCodes.PRODUCT_NOT_FOUND, 
    $"Product {id} not found");

// Wrap excepciones externas
try { ... }
catch (Exception ex)
{
    throw ApiErrorException.InternalServerError(
        ErrorCodes.EXTERNAL_SERVICE_ERROR, ex.Message);
}
```

### ❌ DON'T
```csharp
// ❌ No usar strings mágicos
throw new Exception("Product not found");

// ❌ No ignorar excepciones
catch (Exception ex) { }

// ❌ No exponer detalles sensibles
throw new Exception($"Connection: {connectionString}");
```

## 🎯 Ejemplo Completo

### Service
```csharp
public async Task<ProductDto> GetByIdAsync(int id)
{
    var product = await _repository.GetByIdAsync(id);
    
    if (product == null)
        throw ApiErrorException.NotFound(
            ErrorCodes.PRODUCT_NOT_FOUND, 
            $"Product with ID {id} not found");

    return product;
}

public async Task<ProductDto> CreateAsync(CreateProductDto dto)
{
    try
    {
        var product = _mapper.Map<Product>(dto);
        await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ProductDto>(product);
    }
    catch (DbUpdateException ex)
    {
        throw ApiErrorException.InternalServerError(
            ErrorCodes.PRODUCT_CREATE_FAILED, 
            "Failed to create product");
    }
}
```

### Controller
```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    var product = await _service.GetByIdAsync(id);
    return Ok(ApiResponse<ProductDto>.Ok(product, "Success"));
}

[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList();
        
        throw ApiErrorException.BadRequest(
            ErrorCodes.VALIDATION_ERROR, errors);
    }

    var product = await _service.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), 
        new { id = product.Id }, 
        ApiResponse<ProductDto>.Ok(product, "Created"));
}
```

## 🔧 Archivos del Sistema

```
Application/Common/Errors/
├── ErrorCodes.cs              # Códigos constantes
├── ErrorMessages.cs           # Mensajes en español
├── ApiErrorResponse.cs        # Estructura de respuesta
└── ApiErrorException.cs       # Excepción custom

FacadeApi/Middleware/
└── ErrorHandlingMiddleware.cs # Middleware global

Program.cs
└── app.UseMiddleware<ErrorHandlingMiddleware>() # Registro
```

## 🎉 Ventajas

✅ **Centralizado**: Un solo lugar para códigos y mensajes  
✅ **Estandarizado**: Formato consistente en toda la API  
✅ **Type-safe**: Constantes en lugar de strings  
✅ **Frontend-friendly**: Códigos únicos para manejo específico  
✅ **Logging**: Automático con contexto completo  
✅ **Mantenible**: Fácil agregar nuevos errores  
✅ **Documentado**: Catálogo completo de errores  

¡Sistema de errores completo y listo! 🚀
