import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { UpdateWarehouseInput } from "@/types/warehouse";
import { warehousesApi } from "../api/warehouses-api";

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateWarehouseInput }) =>
      warehousesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouses.all });
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
