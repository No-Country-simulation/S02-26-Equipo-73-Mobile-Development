/**
 * Tipos para el carrito de compras
 */

import type { Product, ProductVariant } from '@/src/services/products.service';

export interface CartItem {
  id: string; // ID único del item en el carrito (product.id + variant.id)
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  total: number;
  itemsCount: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Acciones
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: () => CartSummary;
  getItemQuantity: (productId: number, variantId: number) => number;
  loadCart: () => Promise<void>;
}
