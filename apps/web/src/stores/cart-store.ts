import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  fileType?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null, discount: number) => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  couponCode: null,
  discountAmount: 0,
  isOpen: false,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
        isOpen: true,
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => {
    set({ items: [], couponCode: null, discountAmount: 0 });
  },

  setCoupon: (code, discount) => {
    set({ couponCode: code, discountAmount: discount });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount;
    return Math.max(0, subtotal - discount);
  },
}));
