"use client";

import { useCartSync } from "@/features/cart/hooks/use-cart-sync";

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}
