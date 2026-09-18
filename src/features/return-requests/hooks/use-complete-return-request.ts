import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReturnRequest } from "@/types/return-request";

const ERROR_MESSAGES: Record<string, string> = {
  RETURN_ALREADY_FINALIZED: "Yêu cầu này đã được xử lý xong.",
  INVALID_RETURN_STATUS_TRANSITION: "Chưa xử lý hoàn tiền.",
};

async function completeReturnRequest(id: string) {
  const res = await fetch(`/api/admin/return-requests/${id}/complete`, {
    method: "PATCH",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể hoàn tất yêu cầu đổi trả";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useCompleteReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeReturnRequest,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: "Đã hoàn tất yêu cầu đổi trả",
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
