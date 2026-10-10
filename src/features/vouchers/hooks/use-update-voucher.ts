import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { vouchersApi } from "../api/vouchers-api";
import { queryKeys } from "@/lib/query-keys";
import { UpdateVoucherPayload } from "@/types/voucher";

interface UpdateVoucherInput {
  id: string;
  payload: UpdateVoucherPayload;
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateVoucherInput) => vouchersApi.update(id, payload),
    onSuccess: (data, variables) => {
      toast.add({ type: "success", description: "Đã cập nhật voucher" });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
      queryClient.setQueryData(queryKeys.vouchers.detail(variables.id), data);
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
