import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { suppliersApi } from "../api/suppliers-api";

export function useBulkDeleteSuppliers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => suppliersApi.bulkDelete(ids),
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Xoá nhà cung cấp thành công.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
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
