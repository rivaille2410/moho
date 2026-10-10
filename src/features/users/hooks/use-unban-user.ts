import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "../api/users-api";

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.unban(id),
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Đã mở khoá tài khoản người dùng",
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
