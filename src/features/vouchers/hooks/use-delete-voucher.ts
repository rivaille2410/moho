import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

async function deleteVoucher(id: string): Promise<void> {
  const res = await fetch(`/api/vouchers/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể xóa voucher");
  }
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xóa voucher" });
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
