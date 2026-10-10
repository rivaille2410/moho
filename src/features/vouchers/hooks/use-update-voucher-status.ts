import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { VoucherStatus } from "@/types/voucher";
import { vouchersApi } from "../api/vouchers-api";

interface UpdateVoucherStatusInput {
  id: string;
  status: VoucherStatus;
}

export function useUpdateVoucherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateVoucherStatusInput) =>
      vouchersApi.updateStatus(id, status),
    onSuccess: (data, { id }) => {
      toast.add({ type: "success", description: "Đã cập nhật trạng thái" });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
      queryClient.setQueryData(queryKeys.vouchers.detail(id), data);
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
