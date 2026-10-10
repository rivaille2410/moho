import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "../api/users-api";

interface ChangeRoleInput {
  id: string;
  role: string;
}

export function useChangeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: ChangeRoleInput) => usersApi.changeRole(id, role),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã đổi vai trò người dùng" });
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
