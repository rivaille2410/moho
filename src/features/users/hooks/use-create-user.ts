import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "../api/users-api";

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
  password: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo người dùng mới" });
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
