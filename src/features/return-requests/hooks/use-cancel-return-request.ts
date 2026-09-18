import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReturnRequest } from "@/types/return-request";

async function cancelReturnRequest(id: string) {
  const res = await fetch(`/api/return-requests/${id}/cancel`, {
    method: "PATCH",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể huỷ yêu cầu trả hàng");
  }
  return data as ReturnRequest;
}

export function useCancelReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReturnRequest,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã huỷ yêu cầu trả hàng" });
      queryClient.invalidateQueries({ queryKey: ["my-return-requests"] });
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
