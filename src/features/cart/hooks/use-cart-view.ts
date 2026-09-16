"use client";

import { useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useCart } from "./use-cart";
import { useCartSync } from "./use-cart-sync";
import { useClearCart } from "./use-clear-cart";
import { useAddToCart } from "./use-add-to-cart";
import { useUpdateCartItem } from "./use-update-cart-item";
import { useRemoveCartItem } from "./use-remove-cart-item";

import { useCartStore } from "@/store/cart";
import { CartLineItem, Cart, CartItem } from "@/types/cart";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const isOptimisticId = (id: string | undefined): boolean =>
  !id || id.startsWith("optimistic-");

const QUANTITY_DEBOUNCE_MS = 400;

export interface CartViewItem extends CartLineItem {
  isPending?: boolean;
}

interface CartViewResult {
  items: CartViewItem[];
  hasHydrated: boolean;
  isMerging: boolean;
  addItem: (item: Omit<CartLineItem, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
}

function mapServerItem(item: Cart["items"][number]): CartViewItem {
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
    isPending: isOptimisticId(item.id),
  };
}

export function useCartView(): CartViewResult {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = !!user;
  const { isMerging } = useCartSync();
  const queryClient = useQueryClient();

  const guestItems = useCartStore((s) => s.items);
  const guestHydrated = useCartStore((s) => s.hasHydrated);
  const guestAddItem = useCartStore((s) => s.addItem);
  const guestUpdateQuantity = useCartStore((s) => s.updateQuantity);
  const guestRemoveItem = useCartStore((s) => s.removeItem);
  const guestClear = useCartStore((s) => s.clear);
  const openCart = useCartStore((s) => s.open);

  const { data: serverCart, isLoading: isCartLoading } = useCart({
    enabled: isAuthenticated,
  });
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const wantedQuantity = useRef<Map<string, number>>(new Map());
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const inFlight = useRef<Set<string>>(new Set());

  const patchCacheQuantity = (variantId: string, quantity: number) => {
    queryClient.setQueryData<Cart>(["cart"], (old) => {
      if (!old) return old;

      const items = old.items.map(
        (i): CartItem =>
          i.variantId === variantId
            ? { ...i, quantity, lineTotal: String(Number(i.price) * quantity) }
            : i,
      );

      return {
        ...old,
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: String(
          items.reduce((sum, i) => sum + Number(i.lineTotal), 0),
        ),
      };
    });
  };

  const fireUpdate = (variantId: string) => {
    if (inFlight.current.has(variantId)) return;

    const desired = wantedQuantity.current.get(variantId);
    if (desired === undefined) return;

    const cart = queryClient.getQueryData<Cart>(["cart"]);
    const item = cart?.items.find((i) => i.variantId === variantId);
    if (!item) return;

    if (isOptimisticId(item.id)) return;

    inFlight.current.add(variantId);
    updateCartItem.mutate(
      { id: item.id, input: { quantity: desired } },
      {
        onError: () => {
          wantedQuantity.current.delete(variantId);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onSettled: () => {
          inFlight.current.delete(variantId);

          const latestDesired = wantedQuantity.current.get(variantId);
          if (latestDesired !== undefined && latestDesired !== desired) {
            fireUpdate(variantId);
          }
        },
      },
    );
  };

  const addItem = (item: Omit<CartLineItem, "quantity">, quantity = 1) => {
    openCart();

    if (isAuthenticated) {
      addToCart.mutate({
        variantId: item.variantId,
        quantity,
        optimisticItem: item,
      });
    } else {
      guestAddItem(item, quantity);
    }
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (isAuthenticated) {
      const clamped = Math.max(1, quantity);
      wantedQuantity.current.set(variantId, clamped);
      patchCacheQuantity(variantId, clamped);

      const existingTimer = debounceTimers.current.get(variantId);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(() => {
        debounceTimers.current.delete(variantId);
        fireUpdate(variantId);
      }, QUANTITY_DEBOUNCE_MS);

      debounceTimers.current.set(variantId, timer);
    } else {
      guestUpdateQuantity(variantId, quantity);
    }
  };

  const removeItem = (variantId: string) => {
    if (isAuthenticated) {
      const cart = queryClient.getQueryData<Cart>(["cart"]);
      const item = cart?.items.find((i) => i.variantId === variantId);
      if (!item || isOptimisticId(item.id)) return;

      const timer = debounceTimers.current.get(variantId);
      if (timer) clearTimeout(timer);
      debounceTimers.current.delete(variantId);
      wantedQuantity.current.delete(variantId);

      removeCartItem.mutate(item.id);
    } else {
      guestRemoveItem(variantId);
    }
  };

  if (isUserLoading) {
    return {
      items: [],
      hasHydrated: false,
      isMerging,
      addItem,
      updateQuantity,
      removeItem,
      clear: () => {},
    };
  }

  if (isAuthenticated) {
    return {
      items: (serverCart?.items ?? []).map(mapServerItem),
      hasHydrated: !isCartLoading,
      isMerging,
      addItem,
      updateQuantity,
      removeItem,
      clear: () => clearCartMutation.mutate(),
    };
  }

  return {
    items: guestItems.map((item) => ({ ...item, isPending: false })),
    hasHydrated: guestHydrated,
    isMerging: false,
    addItem,
    updateQuantity,
    removeItem,
    clear: guestClear,
  };
}
