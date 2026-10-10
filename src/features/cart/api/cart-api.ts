import { apiClient } from "@/lib/api-client";
import { Cart } from "@/types/cart";

export const cartApi = {
  get() {
    return apiClient.get<Cart>("/api/cart");
  },

  addItem(variantId: string, quantity = 1) {
    return apiClient.post<Cart>("/api/cart/items", { variantId, quantity });
  },

  updateItem(itemId: string, quantity: number) {
    return apiClient.patch<Cart>(`/api/cart/items/${itemId}`, { quantity });
  },

  removeItem(itemId: string) {
    return apiClient.delete<Cart>(`/api/cart/items/${itemId}`);
  },

  clear() {
    return apiClient.delete<void>("/api/cart");
  },

  sync(items: { variantId: string; quantity: number }[]) {
    return apiClient.post<Cart>("/api/cart/sync", { items });
  },
};
