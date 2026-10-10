import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api/cart-api";
import { queryKeys } from "@/lib/query-keys";
import { Cart } from "@/types/cart";

export function useCart(options?: { enabled?: boolean }) {
  return useQuery<Cart>({
    queryKey: queryKeys.cart.all,
    queryFn: () => cartApi.get(),
    enabled: options?.enabled,
  });
}
