import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  VOUCHERS_NOT_FOUND: "Một số voucher không tồn tại.",
};

async function bulkDeleteVouchers(
  ids: string[],
): Promise<{ deletedCount: number }> {
  const res = await fetch("/api/vouchers/bulk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xóa các voucher đã chọn";
    throw new Error(message);
  }
  return data;
}

export function useBulkDeleteVouchers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteVouchers,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xóa ${data.deletedCount} voucher`,
      });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
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
