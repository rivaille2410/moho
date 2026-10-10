import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { warehousesApi } from "../api/warehouses-api";

export function useBulkDeleteWarehouses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => warehousesApi.bulkDelete(ids),
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Xoá kho hàng thành công.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.warehouses.all });
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
