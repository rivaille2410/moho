import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { vouchersApi } from "../api/vouchers-api";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vouchersApi.delete(id),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xóa voucher" });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
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
