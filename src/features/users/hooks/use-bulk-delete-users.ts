import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "../api/users-api";

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => usersApi.bulkDelete(ids),
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Xoá người dùng thành công.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
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
