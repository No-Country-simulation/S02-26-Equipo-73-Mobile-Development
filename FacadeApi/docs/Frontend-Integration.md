# 🌐 Frontend Integration Examples

## TypeScript/React Example

### 1. Type Definitions

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  brandSizeId: number;
  sizeLabel: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface ProductFilter {
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brandSizeId?: number;
  sortBy?: 'Id' | 'Name' | 'Price' | 'Brand';
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  brandId: number;
  categoryId: number;
}

export interface UpdateProduct {
  name: string;
  description: string;
  price: number;
  brandId: number;
  categoryId: number;
  isActive: boolean;
}
```

¡Listo para integración con cualquier frontend! 🚀
