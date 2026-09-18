import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ReturnRequest,
  RejectReturnRequestInput,
} from "@/types/return-request";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  RETURN_ALREADY_FINALIZED: "Yêu cầu này đã được xử lý xong.",
  INVALID_RETURN_STATUS_TRANSITION: "Yêu cầu không ở trạng thái chờ duyệt.",
};

async function rejectReturnRequest({
  id,
  input,
}: {
  id: string;
  input: RejectReturnRequestInput;
}) {
  const res = await fetch(`/api/admin/return-requests/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể từ chối yêu cầu đổi trả";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useRejectReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectReturnRequest,
    onSuccess: (data) => {
      toast.add({ type: "success", description: "Đã từ chối yêu cầu đổi trả" });
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
