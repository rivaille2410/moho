import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  StockMovement,
  CreateStockAdjustmentInput,
} from "@/types/stock-movement";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  VARIANT_NOT_FOUND: "Không tìm thấy sản phẩm.",
  WAREHOUSE_NOT_FOUND: "Không tìm thấy kho hàng.",
  INSUFFICIENT_STOCK: "Số lượng tồn kho không đủ để điều chỉnh.",
};

async function createStockAdjustment(
  input: CreateStockAdjustmentInput,
): Promise<StockMovement> {
  const res = await fetch("/api/stock-movements/adjustments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể điều chỉnh tồn kho";
    throw new Error(message);
  }
  return data;
}

export function useCreateStockAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStockAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.add({
        type: "success",
        description: "Điều chỉnh tồn kho thành công.",
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
