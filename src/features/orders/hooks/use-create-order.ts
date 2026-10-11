import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { CreateOrderInput } from "@/types/order";
import { invalidatePublicProductCaches } from "@/features/products/hooks/invalidate-product-caches";
import { invalidateOrderDashboardCaches } from "./invalidate-order-dashboard-caches";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      void invalidatePublicProductCaches(queryClient);
      void invalidateOrderDashboardCaches(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
