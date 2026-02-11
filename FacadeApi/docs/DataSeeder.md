# Data Seeder Documentation

## Descripción
Sistema de seed mejorado que puede crear y actualizar datos de prueba en la base de datos.

## Características

- **Upsert automático**: Actualiza datos existentes en lugar de duplicarlos
- **Datos completos**: 15 productos, 5 marcas, 5 categorías, múltiples tallas
- **Idempotente**: Se puede ejecutar múltiples veces sin crear duplicados
- **Relaciones completas**: Products → Variants → BrandSizes → Measurements

## Entidades Seeded

### 1. MeasurementUnits (Unidades de Medida)
- **Centimeters (cm)**: Factor base 1
- **Inches (in)**: Factor base 2.54
- **Millimeters (mm)**: Factor base 0.1

### 2. MeasurementTypes (Tipos de Medición)
- **Foot Length** - Longitud del pie
- **Calf Circumference** - Circunferencia de pantorrilla
- **Ankle Circumference** - Circunferencia de tobillo
- **Instep Height** - Altura del empeine

### 3. SizeSystems (Sistemas de Tallas)
- **EU** - Sistema Europeo
- **US** - Sistema Estadounidense
- **UK** - Sistema Reino Unido
- **International** - Sistema Internacional

### 4. ProductCategories (Categorías)
- **Boots** - Botas
- **Riding Pants** - Pantalones de montar
- **Helmets** - Cascos
- **Gloves** - Guantes
- **Jackets** - Chaquetas

### 5. Brands (Marcas)
- **Ariat** - Marca líder en equipamiento ecuestre
- **Tucci** - Botas italianas de lujo
- **Cavallo** - Productos alemanes de alta calidad
- **Mountain Horse** - Especialistas en clima frío
- **Dublin** - Equipamiento accesible y duradero

### 6. BrandSizes (Tallas por Marca)

#### Ariat:
- EU: 38, 39, 40, 41, 42, 43, 44
- US: 6, 7, 8, 9, 10

#### Tucci:
- EU: 38, 39, 40, 41, 42, 43

#### Cavallo:
- EU: 38, 39, 40, 41, 42

### 7. Products (15 Productos)

#### **Ariat** (4 productos):
1. **Heritage IV Paddock Boot** - $179.99
    - Bota clásica de paddock con elástico

2. **Heritage Contour II Field Zip Boot** - $249.99
    - Bota de campo con tecnología anti-humedad

3. **Challenge Square Toe Dress Boot** - $329.99
   - Bota de vestir profesional con suela de cuero

4. **Devon Pro VX Paddock Boot** - $299.99
   - Bota avanzada con durabilidad mejorada

#### **Tucci** (3 productos):
5. **Harley Tall Boot** - $599.99
   - Bota alta italiana con comodidad superior

6. **Marilyn Tall Boot** - $649.99
   - Bota elegante con cuero de becerro suave

7. **Giovanni Paddock Boot** - $399.99
   - Bota de paddock lujosa con estilo tradicional

#### **Cavallo** (3 productos):
8. **Linus Jump Boot** - $459.99
    - Bota versátil de salto con ajuste excepcional

9. **Piaffe Dressage Boot** - $529.99
   - Bota premium para competidores de doma

10. **Simple Boot** - $189.99
    - Bota sintética fácil de cuidar

#### **Mountain Horse** (2 productos):
11. **Sovereign Field Boot** - $379.99
    - Bota de campo con membrana impermeable

12. **Rimfrost Rider Boot** - $289.99
    - Bota de invierno aislada con calor supremo

#### **Dublin** (3 productos):
13. **River Boots** - $159.99
    - Bota country impermeable para todo clima

14. **Evolution Lace Front Boot** - $199.99
    - Diseño moderno con sistema de cordones frontal

15. **Altitude Riding Boot** - $139.99
    - Bota cómoda para uso diario con gran valor

### 8. ProductVariants (Variantes de Productos)

Cada producto tiene múltiples variantes según las tallas disponibles de su marca:

- **Ariat**: 7 tallas EU = ~28 variantes (4 productos x 7 tallas)
- **Tucci**: 6 tallas EU = ~18 variantes (3 productos x 6 tallas)
- **Cavallo**: 5 tallas EU = ~15 variantes (3 productos x 5 tallas)

**Total: ~61 variantes** con stock aleatorio (3-25 unidades)

### 9. BrandSizeMeasurements

Se generan medidas para las tallas Ariat EU:
- Foot Length (Longitud del pie) en centímetros
- Rango incremental: 24.0cm - 28.9cm (incrementos de 0.7cm)

## Ejecución

El seeder se ejecuta automáticamente al iniciar la aplicación en `Program.cs`:

```csharp
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IDataSeeder>();
    await seeder.SeedAsync();
}
```

## Lógica de Actualización

### Upsert Pattern

Para cada entidad con ID específico:
```csharp
var existing = await _context.Entity.FirstOrDefaultAsync(e => e.Id == id);

if (existing == null)
{
    _context.Entity.Add(new Entity { ... });
}
else
{
    existing.Property = newValue;
    // Actualizar todas las propiedades
}

await _context.SaveChangesAsync();
```

### Para entidades sin ID predefinido:
```csharp
var existing = await _context.Entity.FirstOrDefaultAsync(e => 
    e.UniqueField1 == value1 && e.UniqueField2 == value2);

if (existing == null)
{
    _context.Entity.Add(new Entity { ... });
}
```

## Orden de Ejecución

El orden es crítico debido a las relaciones:

1. **SeedUnits()** - No tiene dependencias
2. **SeedMeasurementTypes()** - No tiene dependencias
3. **SeedSizeSystems()** - No tiene dependencias
4. **SeedCategories()** - No tiene dependencias
5. **SeedBrands()** - No tiene dependencias
6. **SeedBrandSizes()** - Depende de: Brands, Categories, SizeSystems
7. **SeedBrandSizeMeasurements()** - Depende de: BrandSizes, MeasurementTypes, Units
8. **SeedProducts()** - Depende de: Brands, Categories
9. **SeedProductVariants()** - Depende de: Products, BrandSizes

## Ventajas del Nuevo Seeder

### Actualizable
- Puedes modificar los datos en el código y re-ejecutar
- Los datos existentes se actualizan en lugar de duplicarse
- No necesitas limpiar la base de datos

### Datos realistas
- 15 productos reales del mercado ecuestre
- Precios realistas ($139.99 - $649.99)
- Descripciones auténticas
- Stock aleatorio (3-25 unidades)

### Relaciones completas
- Todos los productos tienen variantes
- Todas las variantes tienen tallas específicas
- Las tallas tienen medidas físicas
- Permite probar filtros y búsquedas complejas

### Ideal para testing
- Datos suficientes para probar paginación
- Múltiples marcas para filtrar
- Rango de precios amplio
- Diferentes cantidades de stock

## Ejemplos de Queries con los Datos Seeded

### Obtener productos Ariat entre $100 y $300:
```
GET /api/products?brandId=1&minPrice=100&maxPrice=300
```
Resultado: 3 productos (Heritage IV, Heritage Contour II, Devon Pro VX)

### Obtener productos caros (>$500) ordenados por precio:
```
GET /api/products?minPrice=500&sortBy=Price&sortDescending=true
```
Resultado: 2 productos (Marilyn Tall Boot, Harley Tall Boot)

### Obtener productos económicos (<$200):
```
GET /api/products?maxPrice=200&sortBy=Price
```
Resultado: 4 productos (Altitude, River, Simple, Heritage IV)

### Productos con talla específica (ej: EU 42):
```
GET /api/products?brandSizeId=5
```
Resultado: Productos Ariat que tienen variante en talla 42

## Mantenimiento

Para agregar más datos:

1. **Agregar nueva marca**:
```csharp
new { Id = 6, Name = "Nueva Marca" }
```

2. **Agregar nuevo producto**:
```csharp
new { Id = 16, Name = "...", Description = "...", Price = 199.99m, BrandId = 6, CategoryId = 1, IsActive = true }
```

3. **Agregar tallas para la nueva marca**:
```csharp
new { Id = 24, BrandId = 6, CategoryId = 1, SizeSystemId = 1, Label = "40" }
```

4. Las variantes se generarán automáticamente si sigues el patrón existente

## Notas importantes

- **Stock aleatorio**: El stock se genera con valores aleatorios en cada ejecución de las variantes
- **IDs fijos**: Las entidades base usan IDs específicos para permitir actualizaciones
- **Variantes**: Solo se crean si no existen (no se actualizan para preservar stock)
- **Measurements**: Solo se crean si no existen (operación costosa)

## Verificación

Después de ejecutar el seeder, deberías tener:
- 3 unidades de medida
- 4 tipos de medición
- 4 sistemas de tallas
- 5 categorías
- 5 marcas
- 23 tallas (BrandSizes)
- 7 medidas (BrandSizeMeasurements) para tallas Ariat
- 15 productos
- ~61 variantes de productos
