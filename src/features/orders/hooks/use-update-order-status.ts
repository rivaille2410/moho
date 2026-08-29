import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Order, UpdateOrderStatusInput } from "@/types/order";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_STATUS_TRANSITION: "Không thể chuyển sang trạng thái này.",
};

async function updateOrderStatus({
  id,
  ...input
}: UpdateOrderStatusInput & { id: string }): Promise<Order> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật trạng thái đơn hàng";
    throw new Error(message);
  }
  return data;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (order) => {
      toast.add({
        type: "success",
        description: "Đã cập nhật trạng thái đơn hàng",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
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
