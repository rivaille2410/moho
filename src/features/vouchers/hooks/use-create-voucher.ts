import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { vouchersApi } from "../api/vouchers-api";
import { queryKeys } from "@/lib/query-keys";
import { CreateVoucherPayload } from "@/types/voucher";

export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVoucherPayload) => vouchersApi.create(input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo voucher mới" });
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
