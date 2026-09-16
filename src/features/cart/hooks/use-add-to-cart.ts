import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Cart, CartItem, CartLineItem, AddToCartInput } from "@/types/cart";

const ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_UNAVAILABLE: "Sản phẩm này không còn khả dụng.",
  OUT_OF_STOCK: "Số lượng vượt quá tồn kho hiện có.",
};

async function addToCartRequest(input: AddToCartInput): Promise<Cart> {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể thêm vào giỏ hàng";
    throw new Error(message);
  }
  return data;
}

interface AddToCartVariables extends AddToCartInput {
  optimisticItem?: Omit<CartLineItem, "quantity">;
}

interface AddToCartContext {
  previousCart: Cart | undefined;
}

function calcLineTotal(price: number, quantity: number): string {
  return String(price * quantity);
}

function recalcCartTotals(
  items: CartItem[],
): Pick<Cart, "totalItems" | "subtotal"> {
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: String(items.reduce((sum, i) => sum + Number(i.lineTotal), 0)),
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, AddToCartVariables, AddToCartContext>({
    mutationFn: ({ variantId, quantity }) =>
      addToCartRequest({ variantId, quantity }),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (vars.optimisticItem) {
        const optimisticItem = vars.optimisticItem;

        queryClient.setQueryData<Cart>(["cart"], (old) => {
          const items = old?.items ?? [];
          const existing = items.find((i) => i.variantId === vars.variantId);

          let nextItems: CartItem[];

          if (existing) {
            const nextQuantity = Math.min(
              existing.quantity + vars.quantity,
              existing.stock,
            );
            nextItems = items.map((i) =>
              i.variantId === vars.variantId
                ? {
                    ...i,
                    quantity: nextQuantity,
                    lineTotal: calcLineTotal(Number(i.price), nextQuantity),
                  }
                : i,
            );
          } else {
            const optimisticQuantity = Math.min(
              vars.quantity,
              optimisticItem.maxStock,
            );

            const newEntry: CartItem = {
              id: `optimistic-${vars.variantId}`,
              productId: optimisticItem.productId,
              productSlug: optimisticItem.productSlug,
              productName: optimisticItem.productName,
              sku: optimisticItem.sku,
              variantId: optimisticItem.variantId,
              variantName: optimisticItem.variantName,
              variantColor: optimisticItem.variantColor,
              thumbnailUrl: optimisticItem.thumbnailUrl,
              price: String(optimisticItem.price),
              compareAtPrice:
                optimisticItem.compareAtPrice != null
                  ? String(optimisticItem.compareAtPrice)
                  : null,
              dimensions: optimisticItem.dimensions,
              materials: optimisticItem.materials,
              quantity: optimisticQuantity,
              lineTotal: calcLineTotal(
                optimisticItem.price,
                optimisticQuantity,
              ),
              stock: optimisticItem.maxStock,
            };

            nextItems = [...items, newEntry];
          }

          const base: Cart =
            old ?? ({ id: "optimistic", items: [] } as unknown as Cart);

          return {
            ...base,
            items: nextItems,
            ...recalcCartTotals(nextItems),
          };
        });
      }

      return { previousCart };
    },

    onError: (error, _vars, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },

    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });
}
