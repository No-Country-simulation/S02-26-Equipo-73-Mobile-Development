# Seeder Summary

## Datos generados

```
MeasurementUnits (3)
- Centimeters (cm)
- Inches (in)
- Millimeters (mm)

MeasurementTypes (4)
- Foot Length
- Calf Circumference
- Ankle Circumference
- Instep Height

SizeSystems (4)
- EU
- US
- UK
- International

ProductCategories (5)
- Boots
- Riding Pants
- Helmets
- Gloves
- Jackets

Brands (5)
- Ariat (líder en equipamiento ecuestre)
- Tucci (botas italianas de lujo)
- Cavallo (productos alemanes premium)
- Mountain Horse (especialistas en clima frío)
- Dublin (equipamiento accesible)

Products (15)
- Ariat (4 productos)
    - Heritage IV Paddock Boot ($179.99)
    - Heritage Contour II Field Zip Boot ($249.99)
    - Challenge Square Toe Dress Boot ($329.99)
    - Devon Pro VX Paddock Boot ($299.99)

- Tucci (3 productos)
    - Harley Tall Boot ($599.99)
    - Marilyn Tall Boot ($649.99)
    - Giovanni Paddock Boot ($399.99)

- Cavallo (3 productos)
    - Linus Jump Boot ($459.99)
    - Piaffe Dressage Boot ($529.99)
    - Simple Boot ($189.99)

- Mountain Horse (2 productos)
    - Sovereign Field Boot ($379.99)
    - Rimfrost Rider Boot ($289.99)

- Dublin (3 productos)
    - River Boots ($159.99)
    - Evolution Lace Front Boot ($199.99)
    - Altitude Riding Boot ($139.99)

BrandSizes (23 tallas)
- Ariat EU: 38, 39, 40, 41, 42, 43, 44 (7 tallas)
- Ariat US: 6, 7, 8, 9, 10 (5 tallas)
- Tucci EU: 38, 39, 40, 41, 42, 43 (6 tallas)
- Cavallo EU: 38, 39, 40, 41, 42 (5 tallas)

ProductVariants (~61 variantes)
- Ariat: 4 productos x 7 tallas = 28 variantes
- Tucci: 3 productos x 6 tallas = 18 variantes
- Cavallo: 3 productos x 5 tallas = 15 variantes

BrandSizeMeasurements (7 medidas)
- Ariat EU sizes con Foot Length measurements
```

## Quick stats

| Entidad | Cantidad | Descripción |
|---------|----------|-------------|
| Unidades de Medida | 3 | cm, in, mm |
| Tipos de Medición | 4 | Foot, Calf, Ankle, Instep |
| Sistemas de Tallas | 4 | EU, US, UK, International |
| Categorías | 5 | Boots, Pants, Helmets, Gloves, Jackets |
| Marcas | 5 | Ariat, Tucci, Cavallo, Mountain Horse, Dublin |
| Tallas (BrandSizes) | 23 | Múltiples tallas por marca |
| Productos | 15 | Rango: $139.99 - $649.99 |
| Variantes | ~61 | Stock: 3-25 unidades |
| Medidas | 7 | Foot Length para Ariat EU |

## Características clave

- **Idempotente**: Ejecuta múltiples veces sin duplicar
- **Upsert**: Actualiza datos existentes automáticamente
- **Relaciones completas**: Todas las FK configuradas
- **Datos realistas**: Productos y precios del mercado real
- **Stock aleatorio**: Cada variante tiene 3-25 unidades
- **Fácil expansión**: Estructura modular para agregar más

## Uso rápido

El seeder se ejecuta automáticamente al iniciar la aplicación.

Para probar los endpoints con datos seeded:

```bash
# Obtener todos los productos
GET /api/products

# Filtrar por marca Ariat
GET /api/products?brandId=1

# Productos entre $100-$300
GET /api/products?minPrice=100&maxPrice=300

# Ordenar por precio (más caro primero)
GET /api/products?sortBy=Price&sortDescending=true

# Productos de lujo (>$500)
GET /api/products?minPrice=500
```

## Rangos de precio por marca

| Marca | Rango de precio | Promedio |
|-------|-----------------|----------|
| **Ariat** | $179.99 - $329.99 | $264.99 |
| **Tucci** | $399.99 - $649.99 | $549.99 |
| **Cavallo** | $189.99 - $529.99 | $393.32 |
| **Mountain Horse** | $289.99 - $379.99 | $334.99 |
| **Dublin** | $139.99 - $199.99 | $166.66 |

## Modificar el seeder

Archivo: `Infrastructure/Persistence/Seed/InitialDataSeeder.cs`

Para agregar más productos, simplemente agrega al array:

```csharp
new { 
        Id = 16, 
        Name = "Nuevo Producto", 
        Description = "Descripción detallada", 
        Price = 299.99m, 
        BrandId = 1, 
        CategoryId = 1, 
        IsActive = true 
}
```

Reinicia la aplicación y el producto se agregará automáticamente con sus variantes.
