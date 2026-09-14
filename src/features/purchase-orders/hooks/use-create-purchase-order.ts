import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PurchaseOrder,
  CreatePurchaseOrderInput,
} from "@/types/purchase-order";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  SUPPLIER_NOT_FOUND: "Không tìm thấy nhà cung cấp.",
  WAREHOUSE_NOT_FOUND: "Không tìm thấy kho hàng.",
};

async function createPurchaseOrder(
  input: CreatePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const res = await fetch("/api/purchase-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo đơn nhập hàng";
    throw new Error(message);
  }
  return data;
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.add({
        type: "success",
        description: "Tạo đơn nhập hàng thành công.",
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
