import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  SUPPLIER_HAS_PURCHASE_ORDERS:
    "Không thể xoá vì nhà cung cấp còn đơn nhập hàng.",
};

async function deleteSupplier(id: string): Promise<void> {
  const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xoá nhà cung cấp";
    throw new Error(message);
  }
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.add({
        type: "success",
        description: "Xoá nhà cung cấp thành công.",
        priority: "high",
      });
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
