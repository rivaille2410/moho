import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { UpdateVoucherStatusPayload, Voucher } from "@/types/voucher";

interface UpdateVoucherStatusInput extends UpdateVoucherStatusPayload {
  id: string;
}

async function updateVoucherStatus({
  id,
  ...input
}: UpdateVoucherStatusInput): Promise<Voucher> {
  const res = await fetch(`/api/vouchers/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể cập nhật trạng thái voucher");
  }
  return data;
}

export function useUpdateVoucherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVoucherStatus,
    onSuccess: (data, variables) => {
      toast.add({ type: "success", description: "Đã cập nhật trạng thái" });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      queryClient.setQueryData(["vouchers", variables.id], data);
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
