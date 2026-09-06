"use client";

import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useCartStore } from "@/store/cart";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

async function addToCartRaw(variantId: string, quantity: number) {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  });
  if (!res.ok) throw new Error("Merge failed");
}

export function useCartSync() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const wasAuthenticated = useRef(false);
  const [isMerging, setIsMerging] = useState(false);

  useEffect(() => {
    const isAuthenticated = !!user;

    if (isAuthenticated && !wasAuthenticated.current) {
      const localItems = useCartStore.getState().items;

      if (localItems.length > 0) {
        setIsMerging(true);
        Promise.allSettled(
          localItems.map((item) => addToCartRaw(item.variantId, item.quantity)),
        ).finally(() => {
          useCartStore.getState().clear();
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          setIsMerging(false);
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    }

    if (!isAuthenticated && wasAuthenticated.current) {
      queryClient.removeQueries({ queryKey: ["cart"] });
    }

    wasAuthenticated.current = isAuthenticated;
  }, [user, queryClient]);

  return { isMerging };
}
