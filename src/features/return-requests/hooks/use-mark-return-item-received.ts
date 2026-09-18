import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReturnRequest } from "@/types/return-request";

const ERROR_MESSAGES: Record<string, string> = {
  RETURN_ALREADY_FINALIZED: "Yêu cầu này đã được xử lý xong.",
  INVALID_RETURN_STATUS_TRANSITION: "Yêu cầu chưa được duyệt.",
};

async function markReturnItemReceived(id: string) {
  const res = await fetch(`/api/admin/return-requests/${id}/receive`, {
    method: "PATCH",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật trạng thái nhận hàng";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useMarkReturnItemReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markReturnItemReceived,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: "Đã xác nhận nhận hàng trả về",
      });
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
