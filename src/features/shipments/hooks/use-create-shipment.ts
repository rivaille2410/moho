import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateShipmentInput, Shipment } from "@/types/shipment";

const ERROR_MESSAGES: Record<string, string> = {
  ORDER_NOT_SHIPPABLE: "Đơn hàng không ở trạng thái có thể tạo vận đơn.",
  NOTHING_TO_SHIP: "Mọi sản phẩm của đơn này đã được gán vào vận đơn khác.",
  QUANTITY_EXCEEDS_REMAINING:
    "Số lượng vượt quá số lượng còn lại chưa giao. Vui lòng chọn lại đơn hàng.",
  DUPLICATE_ORDER_ITEMS: "Có sản phẩm bị chọn trùng.",
  ORDER_ITEM_NOT_IN_ORDER: "Có sản phẩm không thuộc đơn hàng đã chọn.",
};

function extractMessage(data: unknown, fallback: string): string {
  const d = data as { code?: string; message?: string | string[] } | null;
  if (d?.code && ERROR_MESSAGES[d.code]) return ERROR_MESSAGES[d.code];
  if (Array.isArray(d?.message)) return d.message.join(", ");
  return d?.message ?? fallback;
}

async function createShipment(input: CreateShipmentInput): Promise<Shipment> {
  const res = await fetch("/api/shipments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(extractMessage(data, "Không thể tạo vận đơn"));
  }
  return data;
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo vận đơn mới" });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
      queryClient.invalidateQueries({
        queryKey: ["shipments", "shippable-orders"],
      });
    },
  });
}
