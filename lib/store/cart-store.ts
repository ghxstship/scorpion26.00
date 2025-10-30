import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types/shop';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Cart actions
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  
  // Cart drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  
  // Item helpers
  getItem: (productId: string, variantId?: string) => CartItem | undefined;
  hasItem: (productId: string, variantId?: string) => boolean;
}

const TAX_RATE = 0.08; // 8% tax rate
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedVariant?.id === variant?.id
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            // Add new item
            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity,
                  selectedVariant: variant,
                },
              ],
            };
          }
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedVariant?.id === variantId
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.selectedVariant?.id === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * TAX_RATE;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = get().getShipping();
        return subtotal + tax + shipping;
      },

      getItem: (productId, variantId) => {
        return get().items.find(
          (item) =>
            item.product.id === productId &&
            item.selectedVariant?.id === variantId
        );
      },

      hasItem: (productId, variantId) => {
        return get().getItem(productId, variantId) !== undefined;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
