# ✅ Relaciones con Usuarios - Implementadas

## 📊 Resumen de Cambios

Se agregaron relaciones con `ApplicationUser` en las entidades principales para auditoría y trazabilidad.

---

## 🔗 Relaciones Agregadas

### **1. UserMeasurement ← ApplicationUser**

**Cambio:** Agregada relación de navegación

```csharp
public class UserMeasurement
{
    public int UserId { get; set; }
    public virtual ApplicationUser User { get; set; }  // ✅ NUEVO
}
```

**AppDbContext:**
```csharp
entity.HasOne(x => x.User)
    .WithMany()
    .HasForeignKey(x => x.UserId)
    .OnDelete(DeleteBehavior.Cascade);
```

---

### **2. Product ← ApplicationUser (Auditoría)**

**Cambios:** Agregados campos de auditoría

```csharp
public class Product
{
    // Auditoría ✅ NUEVO
    public int? CreatedBy { get; set; }
    public virtual ApplicationUser? CreatedByUser { get; set; }
    
    public int? UpdatedBy { get; set; }
    public virtual ApplicationUser? UpdatedByUser { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**AppDbContext:**
```csharp
entity.HasOne(e => e.CreatedByUser)
    .WithMany()
    .HasForeignKey(e => e.CreatedBy)
    .OnDelete(DeleteBehavior.Restrict);

entity.HasOne(e => e.UpdatedByUser)
    .WithMany()
    .HasForeignKey(e => e.UpdatedBy)
    .OnDelete(DeleteBehavior.Restrict);

entity.Property(e => e.CreatedAt)
    .HasDefaultValueSql("GETDATE()");

entity.Property(e => e.UpdatedAt)
    .HasDefaultValueSql("GETDATE()");

entity.HasIndex(e => e.CreatedBy);
entity.HasIndex(e => e.UpdatedBy);
```

---

### **3. Brand ← ApplicationUser (Auditoría)**

**Cambios:** Agregados campos de auditoría

```csharp
public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Auditoría ✅ NUEVO
    public int? CreatedBy { get; set; }
    public virtual ApplicationUser? CreatedByUser { get; set; }
    
    public int? UpdatedBy { get; set; }
    public virtual ApplicationUser? UpdatedByUser { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**AppDbContext:**
```csharp
entity.HasOne(x => x.CreatedByUser)
    .WithMany()
    .HasForeignKey(x => x.CreatedBy)
    .OnDelete(DeleteBehavior.Restrict);

entity.HasOne(x => x.UpdatedByUser)
    .WithMany()
    .HasForeignKey(x => x.UpdatedBy)
    .OnDelete(DeleteBehavior.Restrict);

entity.Property(x => x.CreatedAt)
    .HasDefaultValueSql("GETDATE()");

entity.Property(x => x.UpdatedAt)
    .HasDefaultValueSql("GETDATE()");

entity.HasIndex(x => x.CreatedBy);
entity.HasIndex(x => x.UpdatedBy);
```

---

### **4. ProductCategory ← ApplicationUser (Auditoría)**

**Cambios:** Agregados campos de auditoría

```csharp
public class ProductCategory
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Auditoría ✅ NUEVO
    public int? CreatedBy { get; set; }
    public virtual ApplicationUser? CreatedByUser { get; set; }
    
    public int? UpdatedBy { get; set; }
    public virtual ApplicationUser? UpdatedByUser { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

---

## 📂 Archivos Modificados (5)

1. ✅ `Domain\Entities\Products\Product.cs`
2. ✅ `Domain\Entities\Brand.cs`
3. ✅ `Domain\Entities\ProductCategory.cs`
4. ✅ `Domain\Entities\Measurement\UserMeasurement.cs`
5. ✅ `Infrastructure\Context\AppDbContext.cs`

---

## 🎯 Beneficios

### **Auditoría Completa**
- Saber **quién creó** cada producto, marca, categoría
- Saber **quién modificó** cada registro
- **Timestamps** de creación y actualización

### **Trazabilidad**
```sql
-- Ver quién creó un producto
SELECT p.*, u.Email as CreatedByEmail
FROM Products p
JOIN ApplicationUsers u ON p.CreatedBy = u.Id;

-- Ver quién modificó un producto
SELECT p.*, u.Email as UpdatedByEmail
FROM Products p
JOIN ApplicationUsers u ON p.UpdatedBy = u.Id;
```

### **UserMeasurement vinculado**
```sql
-- Mediciones de un usuario
SELECT um.*, u.Email, mt.Name as MeasurementName
FROM UserMeasurements um
JOIN ApplicationUsers u ON um.UserId = u.Id
JOIN MeasurementTypes mt ON um.MeasurementTypeId = mt.Id
WHERE u.Email = 'user@example.com';
```

---

## 🗄️ Esquema de Relaciones

```
ApplicationUser (1) ────┬──> Product.CreatedBy (N)
                        ├──> Product.UpdatedBy (N)
                        ├──> Brand.CreatedBy (N)
                        ├──> Brand.UpdatedBy (N)
                        ├──> ProductCategory.CreatedBy (N)
                        ├──> ProductCategory.UpdatedBy (N)
                        └──> UserMeasurement.UserId (N)
```

---

## 🚀 Próximos Pasos

### **1. Crear Migración**
```bash
dotnet ef migrations add AddUserRelationsAndAudit -p Infrastructure -s FacadeApi
```

### **2. Aplicar Migración**
```bash
dotnet ef database update -p Infrastructure -s FacadeApi
```

### **3. Actualizar Servicios**

#### **ProductService - Agregar auditoría al crear:**
```csharp
public async Task<ProductDto> CreateProductAsync(CreateProductDto dto, int userId)
{
    var product = _mapper.Map<Product>(dto);
    product.CreatedBy = userId;
    product.UpdatedBy = userId;
    product.CreatedAt = DateTime.UtcNow;
    product.UpdatedAt = DateTime.UtcNow;
    
    // ... guardar
}
```

#### **ProductService - Agregar auditoría al actualizar:**
```csharp
public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto dto, int userId)
{
    var product = await _repository.GetByIdAsync(id);
    
    // ... actualizar campos
    
    product.UpdatedBy = userId;
    product.UpdatedAt = DateTime.UtcNow;
    
    // ... guardar
}
```

#### **ProductController - Obtener userId del JWT:**
```csharp
[HttpPost]
[Authorize(AuthenticationSchemes = "ApiJwt")]
public async Task<IActionResult> CreateProduct(CreateProductDto dto)
{
    var userId = int.Parse(User.FindFirst("userId")?.Value);
    var result = await _productService.CreateProductAsync(dto, userId);
    return Ok(ApiResponse<ProductDto>.Ok(result));
}
```

---

## 📊 Tabla de Migración

### **Campos Agregados:**

| Entidad | Campo | Tipo | Nullable | FK | Index |
|---------|-------|------|----------|-----|-------|
| **Product** | CreatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **Product** | UpdatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **Product** | CreatedAt | DateTime | ❌ | - | ❌ |
| **Product** | UpdatedAt | DateTime | ❌ | - | ❌ |
| **Brand** | CreatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **Brand** | UpdatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **Brand** | CreatedAt | DateTime | ❌ | - | ❌ |
| **Brand** | UpdatedAt | DateTime | ❌ | - | ❌ |
| **ProductCategory** | CreatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **ProductCategory** | UpdatedBy | int | ✅ | ApplicationUsers.Id | ✅ |
| **ProductCategory** | CreatedAt | DateTime | ❌ | - | ❌ |
| **ProductCategory** | UpdatedAt | DateTime | ❌ | - | ❌ |
| **UserMeasurement** | User (navigation) | - | - | FK ya existía | - |

---

## ✅ Ventajas del Sistema de Auditoría

1. ✅ **Compliance**: Saber quién hizo cada cambio
2. ✅ **Debugging**: Rastrear cambios problemáticos
3. ✅ **Security**: Identificar acciones sospechosas
4. ✅ **Analytics**: Métricas de actividad por usuario
5. ✅ **History**: Reconstruir historial de cambios

---

## 🎯 Ejemplo de Uso Completo

### **Crear Producto (con auditoría):**
```csharp
[HttpPost]
[Authorize(AuthenticationSchemes = "ApiJwt")]
public async Task<IActionResult> CreateProduct(CreateProductDto dto)
{
    // Obtener userId del JWT
    var userId = int.Parse(User.FindFirst("userId")?.Value);
    
    // Crear producto
    var product = new Product
    {
        Name = dto.Name,
        Description = dto.Description,
        Price = dto.Price,
        BrandId = dto.BrandId,
        CategoryId = dto.CategoryId,
        IsActive = true,
        CreatedBy = userId,  // ✅ Auditoría
        UpdatedBy = userId,  // ✅ Auditoría
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
    
    await _context.Products.AddAsync(product);
    await _context.SaveChangesAsync();
    
    return Ok(product);
}
```

### **Query con información de auditoría:**
```csharp
var products = await _context.Products
    .Include(p => p.CreatedByUser)
    .Include(p => p.UpdatedByUser)
    .Select(p => new
    {
        p.Id,
        p.Name,
        CreatedByEmail = p.CreatedByUser.Email,
        UpdatedByEmail = p.UpdatedByUser.Email,
        p.CreatedAt,
        p.UpdatedAt
    })
    .ToListAsync();
```

---

**¡Relaciones con usuarios completamente implementadas! 🎉**

**Siguiente paso:** Crear migración y actualizar servicios para usar auditoría.
