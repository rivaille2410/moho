import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateWarehouseInput, Warehouse } from "@/types/warehouse";

async function createWarehouse(
  input: CreateWarehouseInput,
): Promise<Warehouse> {
  const res = await fetch("/api/warehouses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tạo kho hàng");
  }
  return data;
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.add({
        type: "success",
        description: "Tạo kho hàng thành công.",
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
