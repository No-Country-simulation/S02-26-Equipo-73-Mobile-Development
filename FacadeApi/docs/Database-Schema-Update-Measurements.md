# 📊 Database Schema Update - Measurement System

## 🎯 Resumen de Cambios

Se han implementado cambios en el modelo de datos para mejorar el sistema de mediciones y agregar soporte para mediciones de usuarios.

---

## 📦 **Nuevas Entidades Creadas**

### **1. MeasurementEntity**
Representa los tipos de entidades que pueden tener mediciones (Rider, Horse, Product).

```csharp
public class MeasurementEntity
{
    public int Id { get; set; }
    public string Name { get; set; }              // "Rider", "Horse", "Product"
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public virtual ICollection<MeasurementType> MeasurementTypes { get; set; }
}
```

**Datos iniciales:**
- Id: 1, Name: "Rider", Description: "Measurements related to the rider/person"
- Id: 2, Name: "Horse", Description: "Measurements related to horses"
- Id: 3, Name: "Product", Description: "Measurements related to equestrian products"

---

### **2. UserMeasurement**
Almacena las mediciones específicas de cada usuario para sistema de recomendaciones.

```csharp
public class UserMeasurement
{
    public int Id { get; set; }
    public int UserId { get; set; }                    // User from auth system
    public int MeasurementTypeId { get; set; }         // FK to MeasurementTypes
    public virtual MeasurementType MeasurementType { get; set; }
    public decimal Value { get; set; }
    public int UnitId { get; set; }                    // FK to MeasurementUnits
    public virtual MeasurementUnit Unit { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**Ejemplo de datos:**
```json
{
  "userId": 1,
  "measurementTypeId": 1,  // "Foot Length"
  "value": 26.5,
  "unitId": 1              // "cm"
}
```

---

## 🔄 **Entidades Modificadas**

### **3. MeasurementType** (MODIFICADA)

#### **Antes:**
```csharp
public class MeasurementType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string EntityType { get; set; }  // ❌ String (no normalizado)
}
```

#### **Después:**
```csharp
public class MeasurementType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int EntityTypeId { get; set; }           // ✅ FK a MeasurementEntity
    public virtual MeasurementEntity EntityType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**Cambios:**
- ✅ `EntityType` (string) → `EntityTypeId` (int) + Navigation Property
- ✅ Agregados campos `CreatedAt` y `UpdatedAt`
- ✅ Relación normalizada con `MeasurementEntity`

---

### **4. MeasurementUnit** (Sin cambios estructurales)
Ya tenía el campo `ToBaseFactor` que estaba en el esquema.

```csharp
public class MeasurementUnit
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; }
    public decimal? ToBaseFactor { get; set; }  // ✅ Ya existía
}
```

---

## 🗄️ **Configuración de Base de Datos (AppDbContext)**

### **MeasurementEntity**
```csharp
builder.Entity<MeasurementEntity>(entity =>
{
    entity.ToTable("MeasurementEntities");
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Name)
        .IsRequired()
        .HasMaxLength(50);

    entity.Property(x => x.Description)
        .HasMaxLength(255);

    entity.Property(x => x.CreatedAt)
        .HasDefaultValueSql("GETDATE()");

    entity.Property(x => x.UpdatedAt)
        .HasDefaultValueSql("GETDATE()");

    entity.HasIndex(x => x.Name).IsUnique();
});
```

### **MeasurementType (Actualizado)**
```csharp
builder.Entity<MeasurementType>(entity =>
{
    entity.ToTable("MeasurementTypes");
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Name)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(x => x.CreatedAt)
        .HasDefaultValueSql("GETDATE()");

    entity.Property(x => x.UpdatedAt)
        .HasDefaultValueSql("GETDATE()");

    // ✅ Nueva relación con MeasurementEntity
    entity.HasOne(x => x.EntityType)
        .WithMany(e => e.MeasurementTypes)
        .HasForeignKey(x => x.EntityTypeId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasIndex(x => x.Name);
    entity.HasIndex(x => x.EntityTypeId);
});
```

### **UserMeasurement**
```csharp
builder.Entity<UserMeasurement>(entity =>
{
    entity.ToTable("UserMeasurements");
    entity.HasKey(x => x.Id);

    entity.Property(x => x.Value)
        .HasColumnType("decimal(10,2)")
        .IsRequired();

    entity.Property(x => x.CreatedAt)
        .HasDefaultValueSql("GETDATE()");

    entity.Property(x => x.UpdatedAt)
        .HasDefaultValueSql("GETDATE()");

    entity.HasOne(x => x.MeasurementType)
        .WithMany()
        .HasForeignKey(x => x.MeasurementTypeId)
        .OnDelete(DeleteBehavior.Restrict);

    entity.HasOne(x => x.Unit)
        .WithMany()
        .HasForeignKey(x => x.UnitId)
        .OnDelete(DeleteBehavior.Restrict);

    // Índices para queries rápidas
    entity.HasIndex(x => x.UserId);
    entity.HasIndex(x => new { x.UserId, x.MeasurementTypeId });
});
```

---

## 🌱 **Seeders Actualizados**

### **InitialDataSeeder.cs**

#### **Nuevo método: SeedMeasurementEntities()**
```csharp
private async Task SeedMeasurementEntities()
{
    var entities = new[]
    {
        new { Id = 1, Name = "Rider", Description = "Measurements related to the rider/person" },
        new { Id = 2, Name = "Horse", Description = "Measurements related to horses" },
        new { Id = 3, Name = "Product", Description = "Measurements related to equestrian products" }
    };
    // ... lógica de seed
}
```

#### **Método actualizado: SeedMeasurementTypes()**
```csharp
private async Task SeedMeasurementTypes()
{
    var types = new[]
    {
        new { Id = 1, Name = "Foot Length", EntityTypeId = 1 }, // Rider
        new { Id = 2, Name = "Calf Circumference", EntityTypeId = 1 }, // Rider
        new { Id = 3, Name = "Ankle Circumference", EntityTypeId = 1 }, // Rider
        new { Id = 4, Name = "Instep Height", EntityTypeId = 1 }, // Rider
        new { Id = 5, Name = "Boot Height", EntityTypeId = 3 }, // Product
        new { Id = 6, Name = "Boot Shaft Circumference", EntityTypeId = 3 } // Product
    };
    // ... lógica de seed
}
```

---

## 📊 **Diagrama de Relaciones**

```
MeasurementEntity (1) ──────┬──> MeasurementType (N)
                            │
                            └──> UserMeasurement (N)

MeasurementUnit (1) ────────┬──> BrandSizeMeasurement (N)
                            │
                            └──> UserMeasurement (N)

MeasurementType (1) ────────┬──> BrandSizeMeasurement (N)
                            │
                            └──> UserMeasurement (N)
```

---

## 🚀 **Próximos Pasos**

### **1. Crear Migración**
```bash
dotnet ef migrations add AddMeasurementEntityAndUserMeasurements -p Infrastructure -s FacadeApi
```

### **2. Aplicar Migración**
```bash
dotnet ef database update -p Infrastructure -s FacadeApi
```

### **3. Verificar Datos**
```sql
SELECT * FROM MeasurementEntities;
SELECT * FROM MeasurementTypes;
SELECT * FROM UserMeasurements;
```

---

## ✅ **Checklist de Implementación**

- ✅ **MeasurementEntity.cs** creado
- ✅ **UserMeasurement.cs** creado
- ✅ **MeasurementType.cs** modificado (EntityType → EntityTypeId)
- ✅ **MeasurementUnit.cs** documentado (sin cambios)
- ✅ **AppDbContext** actualizado con configuraciones
- ✅ **InitialDataSeeder** actualizado
- ✅ **MeasurementEntitySeeder** creado
- ⏳ **Migración pendiente** (ejecutar manualmente)

---

## 📝 **Ejemplo de Uso: Sistema de Recomendaciones**

### **Flujo:**

1. **Usuario ingresa sus medidas:**
```json
POST /api/user-measurements
{
  "measurementTypeId": 1,  // "Foot Length"
  "value": 26.5,
  "unitId": 1              // "cm"
}
```

2. **Sistema busca productos compatibles:**
```csharp
// Obtener medidas del usuario
var userFootLength = await _context.UserMeasurements
    .Where(um => um.UserId == userId && um.MeasurementTypeId == 1)
    .FirstOrDefaultAsync();

// Buscar tallas compatibles
var compatibleSizes = await _context.BrandSizeMeasurements
    .Where(bsm => bsm.MeasurementTypeId == 1 && 
                  bsm.MinValue <= userFootLength.Value && 
                  bsm.MaxValue >= userFootLength.Value)
    .ToListAsync();
```

3. **Recomendar productos:**
```csharp
var recommendedProducts = await _context.ProductVariants
    .Where(pv => compatibleSizes.Select(cs => cs.BrandSizeId)
                                .Contains(pv.BrandSizeId))
    .Include(pv => pv.Product)
    .ToListAsync();
```

---

## 🎯 **Ventajas del Nuevo Sistema**

1. ✅ **Normalización**: `EntityType` ahora es una tabla separada
2. ✅ **Extensibilidad**: Fácil agregar nuevos tipos de entidades
3. ✅ **Auditoría**: Campos `CreatedAt` y `UpdatedAt`
4. ✅ **Performance**: Índices optimizados para queries
5. ✅ **Recomendaciones**: Sistema de matching usuario-producto
6. ✅ **Escalabilidad**: Separación clara de responsabilidades

---

## 📚 **Archivos Modificados/Creados**

### **Nuevos:**
- `Domain\Entities\Measurement\MeasurementEntity.cs`
- `Domain\Entities\Measurement\UserMeasurement.cs`
- `Infrastructure\Persistence\Seed\MeasurementEntitySeeder.cs`

### **Modificados:**
- `Domain\Entities\Measurement\MeasurementType.cs`
- `Infrastructure\Context\AppDbContext.cs`
- `Infrastructure\Persistence\Seed\InitialDataSeeder.cs`

**¡Sistema de mediciones actualizado y listo para migración! 🎉**
