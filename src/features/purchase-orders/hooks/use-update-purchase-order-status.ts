import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PurchaseOrder,
  UpdatePurchaseOrderStatusInput,
} from "@/types/purchase-order";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_STATUS_TRANSITION:
    "Chỉ được chuyển DRAFT→ORDERED, DRAFT→CANCELLED hoặc ORDERED→CANCELLED tại đây.",
  PURCHASE_ORDER_NOT_FOUND: "Không tìm thấy đơn nhập hàng.",
};

async function updatePurchaseOrderStatus(
  id: string,
  input: UpdatePurchaseOrderStatusInput,
): Promise<PurchaseOrder> {
  const res = await fetch(`/api/purchase-orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật trạng thái";
    throw new Error(message);
  }
  return data;
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdatePurchaseOrderStatusInput;
    }) => updatePurchaseOrderStatus(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", variables.id],
      });
      toast.add({
        type: "success",
        description: "Cập nhật trạng thái thành công.",
        priority: "high",
      });
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
