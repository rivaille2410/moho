import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  variantId: string;
  variantName: string;
  variantColor: string | null;
  thumbnailUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  dimensions: string | null;
  materials: string | null;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;

  open: () => void;
  close: () => void;
  toggle: () => void;
  setHasHydrated: (state: boolean) => void;

  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );

          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              item.maxStock,
            );
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: nextQty }
                  : i,
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantity, item.maxStock) },
            ],
            isOpen: true,
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.variantId === variantId
                ? {
                    ...i,
                    quantity: Math.max(1, Math.min(quantity, i.maxStock)),
                  }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "moho-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useCartTotalQuantity = () =>
  useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  );
