import { useQuery } from "@tanstack/react-query";

import { Cart } from "@/types/cart";

async function fetchCart(): Promise<Cart> {
  const res = await fetch("/api/cart");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải giỏ hàng");
  }
  return data;
}

export function useCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: options?.enabled,
  });
}
