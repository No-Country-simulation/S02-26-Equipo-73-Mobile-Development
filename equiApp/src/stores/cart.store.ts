import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem, CartState, CartSummary } from '@/src/types/cart.types';
import type { Product, ProductVariant } from '@/src/services/products.service';

const CART_STORAGE_KEY = '@equiapp_cart';

/**
 * Helper para guardar el carrito en AsyncStorage
 */
const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

/**
 * Store del carrito de compras con persistencia en AsyncStorage
 */
export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,

  /**
   * Cargar el carrito desde AsyncStorage
   */
  loadCart: async () => {
    try {
      set({ isLoading: true });
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const items = JSON.parse(cartData) as CartItem[];
        set({ items, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Guardar el carrito en AsyncStorage
   */
  saveCart: async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  /**
   * Agregar un producto al carrito o incrementar su cantidad si ya existe
   */
  addItem: (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const state = get();
    const itemId = `${product.id}-${variant.id}`;
    
    const existingItemIndex = state.items.findIndex(item => item.id === itemId);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Si el item ya existe, incrementar la cantidad
      newItems = state.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Crear nuevo item
      const newItem: CartItem = {
        id: itemId,
        product,
        variant,
        quantity,
        addedAt: new Date().toISOString(),
      };
      newItems = [...state.items, newItem];
    }
    
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  /**
   * Eliminar un item del carrito
   */
  removeItem: (itemId: string) => {
    const state = get();
    const newItems = state.items.filter(item => item.id !== itemId);
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  /**
   * Actualizar la cantidad de un item
   */
  updateQuantity: (itemId: string, quantity: number) => {
    const state = get();
    
    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el item
      state.removeItem(itemId);
      return;
    }
    
    const newItems = state.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  /**
   * Vaciar el carrito
   */
  clearCart: () => {
    set({ items: [] });
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  },

  /**
   * Obtener el resumen del carrito (subtotal, total, cantidad de items)
   */
  getCartSummary: (): CartSummary => {
    const state = get();
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );
    
    return {
      subtotal,
      total: subtotal, // Aquí se pueden agregar impuestos o descuentos en el futuro
      itemsCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  },

  /**
   * Obtener la cantidad de un producto específico en el carrito
   */
  getItemQuantity: (productId: number, variantId: number): number => {
    const state = get();
    const itemId = `${productId}-${variantId}`;
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  },
}));

/**
 * Hook simplificado para usar el carrito
 */
export const useCart = () => {
  const store = useCartStore();
  
  return {
    items: store.items,
    isLoading: store.isLoading,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    summary: store.getCartSummary(),
    getItemQuantity: store.getItemQuantity,
    loadCart: store.loadCart,
  };
};
