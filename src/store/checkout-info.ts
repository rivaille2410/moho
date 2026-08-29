import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CheckoutInfo {
  fullName: string;
  phone: string;
  provinceCode?: number;
  wardCode?: number;
  addressDetail: string;
}

interface CheckoutInfoState {
  info: CheckoutInfo | null;
  hasHydrated: boolean;
  setInfo: (info: CheckoutInfo) => void;
  clearInfo: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useCheckoutInfoStore = create<CheckoutInfoState>()(
  persist(
    (set) => ({
      info: null,
      hasHydrated: false,
      setInfo: (info) => set({ info }),
      clearInfo: () => set({ info: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "checkout-info-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
