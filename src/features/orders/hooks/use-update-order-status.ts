import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { ordersApi } from "../api/orders-api";
import { queryKeys } from "@/lib/query-keys";
import { UpdateOrderStatusInput } from "@/types/order";
import { invalidateProductAndPublicCaches } from "@/features/products/hooks/invalidate-product-caches";
import { invalidateOrderDashboardCaches } from "./invalidate-order-dashboard-caches";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, reason }: UpdateOrderStatusInput & { id: string }) =>
      ordersApi.updateStatus(id, status, reason),
    onSuccess: (order) => {
      void invalidateProductAndPublicCaches(queryClient);
      void invalidateOrderDashboardCaches(queryClient);
      toast.add({
        type: "success",
        description: "Đã cập nhật trạng thái đơn hàng",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(order.id) });
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
