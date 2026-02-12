# 📸 MediaProduct System - Complete Implementation

## Descripción
Sistema completo para gestión de imágenes/media de productos con soporte para URLs y base64, integrado con AWS S3/MinIO.

## 🏗️ Arquitectura

### Entidades

#### **MediaProduct.cs**
```csharp
public class MediaProduct
{
    public int Id { get; set; }
    public string Url { get; set; }              // URL en S3/MinIO
    public string MediaType { get; set; }        // "image", "video"
    public int Order { get; set; }               // Orden de visualización
    public bool IsPrimary { get; set; }          // Imagen principal
    public int ProductId { get; set; }
    public virtual Product Product { get; set; }
}
```

#### **Product.cs** (actualizado)
```csharp
public class Product
{
    // ... propiedades existentes ...
    public virtual ICollection<MediaProduct> MediaProducts { get; set; }
}
```

### DTOs

#### **MediaProductDto.cs** (para GET)
```csharp
public class MediaProductDto
{
    public int Id { get; set; }
    public string Url { get; set; }         // URL pública
    public string MediaType { get; set; }
    public int Order { get; set; }
    public bool IsPrimary { get; set; }
}
```

#### **MediaProductInputDto.cs** (para POST/PUT)
```csharp
public class MediaProductInputDto
{
    public string Value { get; set; }       // Base64 O URL
    public string MediaType { get; set; }
    public int Order { get; set; }
    public bool IsPrimary { get; set; }
    public int? Id { get; set; }           // Para updates
}
```

## 📋 Configuración de Base de Datos

### AppDbContext.cs
```csharp
builder.Entity<MediaProduct>(entity =>
{
    entity.ToTable("MediaProducts");
    entity.HasKey(e => e.Id);

    entity.Property(e => e.Url)
        .IsRequired()
        .HasMaxLength(500);

    entity.Property(e => e.MediaType)
        .IsRequired()
        .HasMaxLength(50)
        .HasDefaultValue("image");

    entity.Property(e => e.Order)
        .HasDefaultValue(0);

    entity.Property(e => e.IsPrimary)
        .HasDefaultValue(false);

    entity.HasOne(e => e.Product)
        .WithMany(p => p.MediaProducts)
        .HasForeignKey(e => e.ProductId)
        .OnDelete(DeleteBehavior.Cascade);

    // Índices para performance
    entity.HasIndex(e => e.ProductId);
    entity.HasIndex(e => new { e.ProductId, e.IsPrimary });
    entity.HasIndex(e => new { e.ProductId, e.Order });
});
```

## 🎯 Lógica de Negocio

### Reglas

1. **GET siempre retorna URLs**
   - Los clientes reciben URLs públicas de las imágenes
   - Listas para usar directamente en `<img src="...">`

2. **POST/PUT pueden recibir:**
   - **Base64**: Se sube la imagen nueva a S3/MinIO
   - **URL**: Se mantiene la imagen existente (no hay cambio)

3. **UPDATE de imágenes:**
   - Imágenes con `Id`: Se actualizan
   - Imágenes sin `Id`: Se crean nuevas
   - Imágenes no en la lista: Se eliminan

## 🔄 Flujo de Datos

### CREATE Product (POST)

```
Cliente → POST /api/products
{
  "name": "Boot",
  "price": 199.99,
  "media": [
    {
      "value": "data:image/jpeg;base64,/9j/4AAQ...",  // Base64
      "order": 0,
      "isPrimary": true
    },
    {
      "value": "data:image/png;base64,iVBOR...",      // Base64
      "order": 1,
      "isPrimary": false
    }
  ]
}

↓

ProductService.CreateProductAsync()
  → ProcessMediaAsync()
     → IsUrl() → false (es base64)
     → StorageService.ProcessImageUrlAsync()
        → Valida formato
        → Valida tamaño (max 10MB)
        → Sube a S3: products/guid-1.jpg
        → Retorna URL: https://cdn.example.com/products/guid-1.jpg

↓

ProductRepository.CreateAsync()
  → Crea Product en BD

↓

ProductRepository.UpdateMediaAsync()
  → Crea registros MediaProduct con URLs

↓

ProductRepository.GetByIdAsync()
  → Retorna Product con Media (URLs)

↓

Cliente ← 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Boot",
    "media": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/guid-1.jpg",
        "order": 0,
        "isPrimary": true
      },
      {
        "id": 2,
        "url": "https://cdn.example.com/products/guid-2.png",
        "order": 1,
        "isPrimary": false
      }
    ]
  }
}
```

### UPDATE Product (PUT)

```
Cliente → PUT /api/products/1
{
  "name": "Updated Boot",
  "price": 249.99,
  "media": [
    {
      "id": 1,
      "value": "https://cdn.example.com/products/guid-1.jpg",  // URL (NO CAMBIO)
      "order": 0,
      "isPrimary": true
    },
    {
      "value": "data:image/jpeg;base64,NEW_IMAGE...",          // Base64 (NUEVA IMAGEN)
      "order": 1,
      "isPrimary": false
    }
    // Imagen con id=2 NO está en lista → SE ELIMINA
  ]
}

↓

ProductService.UpdateProductAsync()
  → ProcessMediaAsync()
     → Media 1: IsUrl() → true → Mantiene URL
     → Media 2: IsUrl() → false → Sube nueva imagen

↓

ProductRepository.UpdateAsync()
  → Actualiza Product

↓

ProductRepository.UpdateMediaAsync()
  → MediaProducts con id=1 → Actualiza
  → MediaProducts sin id → Crea nuevo
  → MediaProducts con id=2 no en lista → Elimina

↓

Cliente ← 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Boot",
    "media": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/guid-1.jpg",  // MANTENIDA
        "order": 0,
        "isPrimary": true
      },
      {
        "id": 3,
        "url": "https://cdn.example.com/products/guid-3.jpg",  // NUEVA
        "order": 1,
        "isPrimary": false
      }
    ]
  }
}
```

## 💻 Código Clave

### ProductService.ProcessMediaAsync()

```csharp
private async Task<List<MediaProductInputDto>> ProcessMediaAsync(
    List<MediaProductInputDto> mediaInputs)
{
    var processedMedia = new List<MediaProductInputDto>();
    const string folder = "products";

    foreach (var media in mediaInputs)
    {
        if (string.IsNullOrWhiteSpace(media.Value))
            continue;

        // Si es URL → mantener (imagen existente)
        if (media.Value.IsUrl())
        {
            processedMedia.Add(media);
            continue;
        }

        // Si es base64 → subir a S3
        try
        {
            var uploadedUrl = await _storageService.ProcessImageUrlAsync(
                media.Value,
                folder);

            processedMedia.Add(new MediaProductInputDto
            {
                Id = media.Id,
                Value = uploadedUrl,  // Ahora es URL
                MediaType = media.MediaType,
                Order = media.Order,
                IsPrimary = media.IsPrimary
            });
        }
        catch (Exception ex)
        {
            throw ApiErrorException.InternalServerError(
                ErrorCodes.EXTERNAL_SERVICE_ERROR,
                $"Failed to upload image: {ex.Message}");
        }
    }

    return processedMedia;
}
```

### ProductRepository.UpdateMediaAsync()

```csharp
public async Task UpdateMediaAsync(int productId, List<MediaProductInputDto> media)
{
    // Obtener media existentes
    var existingMedia = await _context.MediaProducts
        .Where(m => m.ProductId == productId)
        .ToListAsync();

    // IDs a mantener
    var mediaIdsToKeep = media
        .Where(m => m.Id.HasValue)
        .Select(m => m.Id.Value)
        .ToList();

    // Eliminar media que ya no están
    var mediaToDelete = existingMedia
        .Where(m => !mediaIdsToKeep.Contains(m.Id))
        .ToList();

    if (mediaToDelete.Any())
    {
        _context.MediaProducts.RemoveRange(mediaToDelete);
    }

    // Actualizar o agregar
    foreach (var mediaInput in media)
    {
        if (mediaInput.Id.HasValue)
        {
            // Actualizar existente
            var existing = existingMedia.FirstOrDefault(m => m.Id == mediaInput.Id.Value);
            if (existing != null)
            {
                existing.Url = mediaInput.Value;
                existing.MediaType = mediaInput.MediaType;
                existing.Order = mediaInput.Order;
                existing.IsPrimary = mediaInput.IsPrimary;
            }
        }
        else
        {
            // Crear nuevo
            var newMedia = new MediaProduct
            {
                ProductId = productId,
                Url = mediaInput.Value,
                MediaType = mediaInput.MediaType,
                Order = mediaInput.Order,
                IsPrimary = mediaInput.IsPrimary
            };
            _context.MediaProducts.Add(newMedia);
        }
    }

    await _context.SaveChangesAsync();
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Crear Producto con Imágenes

**Request:**
```json
POST /api/products
{
  "name": "Ariat Heritage Boot",
  "description": "Classic western boot",
  "price": 199.99,
  "brandId": 1,
  "categoryId": 1,
  "media": [
    {
      "value": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "mediaType": "image",
      "order": 0,
      "isPrimary": true
    },
    {
      "value": "data:image/jpeg;base64,iVBORw0KGgo...",
      "mediaType": "image",
      "order": 1,
      "isPrimary": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Ariat Heritage Boot",
    "price": 199.99,
    "media": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/abc-123.jpg",
        "mediaType": "image",
        "order": 0,
        "isPrimary": true
      },
      {
        "id": 2,
        "url": "https://cdn.example.com/products/def-456.jpg",
        "mediaType": "image",
        "order": 1,
        "isPrimary": false
      }
    ]
  }
}
```

### Ejemplo 2: Actualizar - Mantener una imagen, agregar nueva

**Request:**
```json
PUT /api/products/1
{
  "name": "Ariat Heritage Boot",
  "price": 219.99,
  "brandId": 1,
  "categoryId": 1,
  "isActive": true,
  "media": [
    {
      "id": 1,
      "value": "https://cdn.example.com/products/abc-123.jpg",  // MANTENER
      "order": 0,
      "isPrimary": true
    },
    {
      "value": "data:image/jpeg;base64,NEW_IMAGE_BASE64...",    // NUEVA
      "order": 1,
      "isPrimary": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Ariat Heritage Boot",
    "media": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/abc-123.jpg",  // MANTENIDA
        "order": 0,
        "isPrimary": true
      },
      {
        "id": 3,
        "url": "https://cdn.example.com/products/xyz-789.jpg",  // NUEVA
        "order": 1,
        "isPrimary": false
      }
    ]
  }
}
```

### Ejemplo 3: GET Producto (siempre URLs)

**Request:**
```
GET /api/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Ariat Heritage Boot",
    "media": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/abc-123.jpg",
        "order": 0,
        "isPrimary": true
      },
      {
        "id": 3,
        "url": "https://cdn.example.com/products/xyz-789.jpg",
        "order": 1,
        "isPrimary": false
      }
    ]
  }
}
```

## 🔒 Validaciones

### En MediaHelper.cs

1. **Formato de imagen:**
```csharp
if (!imageData.ValidateImageFormat())
    throw ApiErrorException.BadRequest("Invalid image format");
```

2. **Tamaño de archivo (max 10MB):**
```csharp
if (!imageData.ValidateFileSize(10))
    throw ApiErrorException.BadRequest("Image too large");
```

3. **Detección URL vs Base64:**
```csharp
if (imageData.IsUrl())
    // Es URL existente
else
    // Es base64 nuevo
```

## 🎨 Frontend Integration

### React Example

```typescript
interface Media {
  id?: number;
  value: string;  // URL or base64
  order: number;
  isPrimary: boolean;
}

// CREATE con base64
const createProduct = async (files: File[]) => {
  const media: Media[] = await Promise.all(
    files.map(async (file, index) => ({
      value: await fileToBase64(file),
      order: index,
      isPrimary: index === 0
    }))
  );

  await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name: "Product",
      price: 199.99,
      brandId: 1,
      categoryId: 1,
      media
    })
  });
};

// UPDATE mantener URLs, agregar nuevas
const updateProduct = async (productId: number, existingMedia: Media[], newFiles: File[]) => {
  // Mantener URLs existentes
  const kept Media = existingMedia.map(m => ({
    id: m.id,
    value: m.url,  // URL (no se actualiza)
    order: m.order,
    isPrimary: m.isPrimary
  }));

  // Agregar nuevas (base64)
  const newMedia = await Promise.all(
    newFiles.map(async (file, index) => ({
      value: await fileToBase64(file),
      order: existingMedia.length + index,
      isPrimary: false
    }))
  );

  await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...productData,
      media: [...keptMedia, ...newMedia]
    })
  });
};
```

## ✅ Checklist de Implementación

- ✅ **MediaProduct entity** creada
- ✅ **MediaProductDto** para GET
- ✅ **MediaProductInputDto** para POST/PUT
- ✅ **AppDbContext** configurado con índices
- ✅ **AutoMapper** configurado
- ✅ **ProductRepository.UpdateMediaAsync** implementado
- ✅ **ProductService.ProcessMediaAsync** implementado
- ✅ **StorageService.ProcessImageUrlAsync** implementado
- ✅ **IStorageService** actualizado
- ✅ **Validaciones** de formato y tamaño
- ✅ **Compilación exitosa**

## 🎉 Resultado Final

### Funcionalidades:
- ✅ Crear productos con múltiples imágenes (base64)
- ✅ Actualizar productos manteniendo imágenes existentes (URL)
- ✅ Actualizar productos agregando nuevas imágenes (base64)
- ✅ Eliminar imágenes (al no incluirlas en update)
- ✅ Ordenamiento de imágenes
- ✅ Imagen principal (isPrimary)
- ✅ GET siempre retorna URLs
- ✅ Validación de formato y tamaño
- ✅ Integrado con S3/MinIO

¡Sistema MediaProduct completamente funcional! 🚀
