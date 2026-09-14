import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  WAREHOUSE_HAS_STOCK: "Không thể xoá vì kho hàng còn tồn kho.",
};

async function deleteWarehouse(id: string): Promise<void> {
  const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xoá kho hàng";
    throw new Error(message);
  }
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.add({
        type: "success",
        description: "Xoá kho hàng thành công.",
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
