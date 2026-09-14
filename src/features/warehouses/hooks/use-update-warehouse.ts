import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { UpdateWarehouseInput, Warehouse } from "@/types/warehouse";

const ERROR_MESSAGES: Record<string, string> = {
  WAREHOUSE_NOT_FOUND: "Không tìm thấy kho hàng.",
};

async function updateWarehouse(
  id: string,
  input: UpdateWarehouseInput,
): Promise<Warehouse> {
  const res = await fetch(`/api/warehouses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật kho hàng";
    throw new Error(message);
  }
  return data;
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateWarehouseInput }) =>
      updateWarehouse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.add({
        type: "success",
        description: "Cập nhật kho hàng thành công.",
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
