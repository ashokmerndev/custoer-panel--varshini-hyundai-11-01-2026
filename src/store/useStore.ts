import { create } from "zustand";

// 1. Image Interface (Updated to match API)
export interface ProductImage {
  _id: string; // API sends _id
  url: string;
  publicId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses?: Address[];
}

export interface Address {
  _id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// 2. Product Interface (Updated to match API & Fix Errors)
export interface Product {
  _id: string;
  name: string;
  partNumber?: string;
  description?: string;
  category: string;
  // API sends objects, but if you just need names, handled in component
  compatibleModels?: any[];

  price: number;
  discountPrice?: number;
  finalPrice?: number; // Added: Needed for Price Logic

  stock: number;
  stockStatus?: string; // Added: API sends "In Stock"

  // Optional helper to keep TS happy if you use 'status' manually anywhere
  status?: "In Stock" | "Low Stock" | "Out of Stock" | string;

  images: ProductImage[]; // Updated: Now includes _id

  specifications?: Record<string, any>;
  warrantyPeriod?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  taxPercentage: number;
  shippingCharges: number;
  totalAmount: number;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart state
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  cartItemCount: number;
  updateCartItemCount: () => void;

  // UI state
  theme: "dark" | "light";
  toggleTheme: () => void;
  isCartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () =>
    set({ user: null, isAuthenticated: false, cart: null, cartItemCount: 0 }),

  // Cart state
  cart: null,
  setCart: (cart) => {
    set({ cart });
    get().updateCartItemCount();
  },
  cartItemCount: 0,
  updateCartItemCount: () => {
    const cart = get().cart;
    const count =
      cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    set({ cartItemCount: count });
  },

  // UI state
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
  isCartDrawerOpen: false,
  toggleCartDrawer: () =>
    set((state) => ({
      isCartDrawerOpen: !state.isCartDrawerOpen,
    })),
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    })),

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
