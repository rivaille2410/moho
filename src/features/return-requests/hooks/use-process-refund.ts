import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ProcessRefundInput, ReturnRequest } from "@/types/return-request";

const ERROR_MESSAGES: Record<string, string> = {
  RETURN_ALREADY_FINALIZED: "Yêu cầu này đã được xử lý xong.",
  INVALID_RETURN_STATUS_TRANSITION: "Chưa xác nhận nhận hàng trả về.",
};

async function processRefund({
  id,
  input,
}: {
  id: string;
  input: ProcessRefundInput;
}) {
  const res = await fetch(`/api/admin/return-requests/${id}/refund`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xử lý hoàn tiền";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useProcessRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processRefund,
    onSuccess: (data) => {
      toast.add({ type: "success", description: "Đã xử lý hoàn tiền" });
      queryClient.invalidateQueries({ queryKey: ["return-requests"] });
      queryClient.invalidateQueries({ queryKey: ["return-requests", data.id] });
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
