import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Shipment, UpdateShipmentStatusInput } from "@/types/shipment";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_STATUS_TRANSITION: "Không thể chuyển sang trạng thái này.",
  SHIPMENT_STATUS_CHANGED:
    "Trạng thái vận đơn vừa được người khác thay đổi, vui lòng tải lại.",
  ORDER_NOT_SHIPPABLE:
    "Đơn hàng không ở trạng thái cho phép giao (có thể đã bị huỷ).",
  FAILED_REASON_REQUIRED: "Vui lòng nhập lý do giao thất bại.",
  COLLECTED_AMOUNT_NOT_ALLOWED: "Chỉ nhập số tiền đã thu khi xác nhận đã giao.",
  COD_PAYMENT_NOT_FOUND:
    "Đơn hàng này không có thanh toán COD để ghi nhận thu tiền.",
  COD_ALREADY_COLLECTED:
    "Thanh toán COD của đơn này đã được xác nhận trước đó.",
};

function extractMessage(data: unknown, fallback: string): string {
  const d = data as { code?: string; message?: string | string[] } | null;
  if (d?.code && ERROR_MESSAGES[d.code]) return ERROR_MESSAGES[d.code];
  if (Array.isArray(d?.message)) return d.message.join(", ");
  return d?.message ?? fallback;
}

async function updateShipmentStatus({
  id,
  input,
}: {
  id: string;
  input: UpdateShipmentStatusInput;
}): Promise<Shipment> {
  const res = await fetch(`/api/shipments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      extractMessage(data, "Không thể cập nhật trạng thái vận đơn"),
    );
  }
  return data;
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShipmentStatus,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã cập nhật trạng thái" });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
