import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PurchaseOrder,
  ReceivePurchaseOrderInput,
} from "@/types/purchase-order";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  PURCHASE_ORDER_NOT_FOUND: "Không tìm thấy đơn nhập hàng.",
  INVALID_RECEIVE_QUANTITY: "Số lượng nhận không hợp lệ.",
};

async function receivePurchaseOrder(
  id: string,
  input: ReceivePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const res = await fetch(`/api/purchase-orders/${id}/receive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể nhận hàng";
    throw new Error(message);
  }
  return data;
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ReceivePurchaseOrderInput;
    }) => receivePurchaseOrder(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.add({
        type: "success",
        description: "Nhận hàng thành công.",
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
