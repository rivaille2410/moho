"use client";

import { useCart } from "./use-cart";
import { useCartSync } from "./use-cart-sync";
import { useClearCart } from "./use-clear-cart";
import { useAddToCart } from "./use-add-to-cart";
import { useUpdateCartItem } from "./use-update-cart-item";
import { useRemoveCartItem } from "./use-remove-cart-item";

import { useCartStore } from "@/store/cart";
import { CartLineItem, Cart } from "@/types/cart";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

function mapServerItem(item: Cart["items"][number]): CartLineItem {
  return {
    productId: item.productId,
    productSlug: item.productSlug,
    productName: item.productName,
    sku: item.sku,
    variantId: item.variantId,
    variantName: item.variantName,
    variantColor: item.variantColor,
    thumbnailUrl: item.thumbnailUrl,
    price: Number(item.price),
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
    dimensions: item.dimensions,
    materials: item.materials,
    quantity: item.quantity,
    maxStock: item.stock,
  };
}

export function useCartView() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = !!user;
  const { isMerging } = useCartSync();

  const guestItems = useCartStore((s) => s.items);
  const guestHydrated = useCartStore((s) => s.hasHydrated);
  const guestAddItem = useCartStore((s) => s.addItem);
  const guestUpdateQuantity = useCartStore((s) => s.updateQuantity);
  const guestRemoveItem = useCartStore((s) => s.removeItem);
  const guestClear = useCartStore((s) => s.clear);

  const { data: serverCart, isLoading: isCartLoading } = useCart({
    enabled: isAuthenticated,
  });
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const addItem = (item: Omit<CartLineItem, "quantity">, quantity = 1) => {
    if (isAuthenticated) {
      addToCart.mutate({ variantId: item.variantId, quantity });
    } else {
      guestAddItem(item, quantity);
    }
  };

  if (isUserLoading) {
    return {
      items: [] as CartLineItem[],
      hasHydrated: false,
      isMerging,
      addItem,
      updateQuantity: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }

  if (isAuthenticated) {
    const idByVariant = new Map(
      (serverCart?.items ?? []).map((i) => [i.variantId, i.id]),
    );

    return {
      items: (serverCart?.items ?? []).map(mapServerItem),
      hasHydrated: !isCartLoading,
      isMerging,
      addItem,
      updateQuantity: (variantId: string, quantity: number) => {
        const id = idByVariant.get(variantId);
        if (id) updateCartItem.mutate({ id, input: { quantity } });
      },
      removeItem: (variantId: string) => {
        const id = idByVariant.get(variantId);
        if (id) removeCartItem.mutate(id);
      },
      clear: () => clearCartMutation.mutate(),
    };
  }

  return {
    items: guestItems,
    hasHydrated: guestHydrated,
    isMerging: false,
    addItem,
    updateQuantity: guestUpdateQuantity,
    removeItem: guestRemoveItem,
    clear: guestClear,
  };
}
