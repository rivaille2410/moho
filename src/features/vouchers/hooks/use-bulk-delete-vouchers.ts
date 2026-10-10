import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { vouchersApi } from "../api/vouchers-api";

export function useBulkDeleteVouchers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => vouchersApi.bulkDelete(ids),
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Xoá voucher thành công.",
      });
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
