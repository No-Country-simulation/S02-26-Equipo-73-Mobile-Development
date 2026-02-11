# Products API Documentation

## Overview
CRUD completo para productos siguiendo Clean Architecture con filtros avanzados, paginación y ordenamiento.

## Endpoints

### 1. Get All Products (con filtros)
**GET** `/api/products`

#### Query Parameters:
- `brandId` (int, opcional): Filtrar por marca
- `categoryId` (int, opcional): Filtrar por categoría
- `minPrice` (decimal, opcional): Precio mínimo
- `maxPrice` (decimal, opcional): Precio máximo
- `brandSizeId` (int, opcional): Filtrar por talla específica
- `sortBy` (enum, opcional): Campo para ordenar. Valores: `Id`, `Name`, `Price`, `Brand`
- `sortDescending` (bool, opcional): Orden descendente (default: false)
- `pageNumber` (int, opcional): Número de página (default: 1)
- `pageSize` (int, opcional): Tamaño de página (default: 10, max: 100)

#### Ejemplo:
```
GET /api/products?brandId=1&minPrice=50&maxPrice=200&sortBy=Price&sortDescending=false&pageNumber=1&pageSize=10
```

#### Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "isActive": true,
      "brandId": 1,
      "brandName": "Ariat",
      "categoryId": 1,
      "categoryName": "Boots",
      "variants": [
        {
          "id": 1,
          "productId": 1,
          "brandSizeId": 1,
          "sizeLabel": "42",
          "price": 99.99,
          "stock": 10,
          "isActive": true
        }
      ]
    }
  ],
  "totalCount": 50,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "hasPrevious": false,
  "hasNext": true
}
```

---

### 2. Get Product By ID
**GET** `/api/products/{id}`

#### Response:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "isActive": true,
  "brandId": 1,
  "brandName": "Ariat",
  "categoryId": 1,
  "categoryName": "Boots",
  "variants": [...]
}
```

---

### 3. Create Product
**POST** `/api/products`

#### Request Body:
```json
{
  "name": "New Product",
  "description": "Product Description",
  "price": 149.99,
  "brandId": 1,
  "categoryId": 1
}
```

#### Validations:
- `name`: Required, max 100 characters
- `description`: Required, max 500 characters
- `price`: Required, must be > 0
- `brandId`: Required, must be > 0
- `categoryId`: Required, must be > 0

#### Response:
```json
{
  "id": 2,
  "name": "New Product",
  "description": "Product Description",
  "price": 149.99,
  "isActive": true,
  "brandId": 1,
  "brandName": "Ariat",
  "categoryId": 1,
  "categoryName": "Boots",
  "variants": []
}
```

---

### 4. Update Product
**PUT** `/api/products/{id}`

#### Request Body:
```json
{
  "name": "Updated Product",
  "description": "Updated Description",
  "price": 179.99,
  "brandId": 1,
  "categoryId": 1,
  "isActive": true
}
```

#### Response:
```json
{
  "id": 1,
  "name": "Updated Product",
  ...
}
```

---

### 5. Delete Product
**DELETE** `/api/products/{id}`

#### Response:
- **204 No Content** - Si se eliminó correctamente
- **404 Not Found** - Si el producto no existe

---

## Arquitectura

### Clean Architecture Layers:

```
FacadeApi/
  - Controllers/
    - ProductsController.cs        # API endpoints

Application/
  - DTOs/
    - Products/
      - ProductDto.cs
      - CreateProductDto.cs
      - UpdateProductDto.cs
      - ProductFilterDto.cs
      - ProductVariantDto.cs
    - Common/
      - PagedResult.cs
  - Interfaces/
    - Repositories/
      - IProductRepository.cs
  - Services/
    - Products/
      - IProductService.cs
      - ProductService.cs

Infrastructure/
  - Repositories/
    - ProductRepository.cs         # Data access
  - Extensions/
    - ServiceCollectionExtensions.cs  # DI registration

Domain/
  - Entities/
    - Products/
      - Product.cs
      - ProductVariant.cs
```

### Dependency Injection:
Los servicios se registran automáticamente en `ServiceCollectionExtensions.cs`:
- `IProductRepository` → `ProductRepository`
- `IProductService` → `ProductService`

---

## Características implementadas

- **CRUD completo** (Create, Read, Update, Delete)
- **Filtros avanzados**: Marca, categoría, precio, talla
- **Ordenamiento con Enum**: Por Id, Name, Price o Brand (ascendente/descendente)
- **Paginación**: Control completo de páginas y tamaño
- **Validaciones**: En DTOs con Data Annotations
- **Clean Architecture**: Separación clara de capas
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio centralizada
- **DTOs**: Separación de entidades de dominio y respuestas API
- **Includes optimizados**: Eager loading de relaciones
- **Paged Results**: Metadata de paginación incluida
- **OpenAPI/Swagger**: Enums visibles en la documentación automática

---

## Ejemplos de Uso

### Obtener productos de marca Ariat ordenados por precio:
```
GET /api/products?brandId=1&sortBy=Price&pageSize=20
```

### Obtener productos entre $50 y $200 ordenados por nombre descendente:
```
GET /api/products?minPrice=50&maxPrice=200&sortBy=Name&sortDescending=true
```

### Obtener productos de categoría Boots con talla específica:
```
GET /api/products?categoryId=1&brandSizeId=5
```

### Obtener productos ordenados por marca:
```
GET /api/products?sortBy=Brand
```

### Crear un nuevo producto:
```
POST /api/products
Content-Type: application/json

{
  "name": "Ariat Heritage Boot",
  "description": "Classic equestrian boot",
  "price": 199.99,
  "brandId": 1,
  "categoryId": 1
}
```
