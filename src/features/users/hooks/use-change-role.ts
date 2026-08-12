import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type UserListItem } from "./use-users";

interface ChangeRoleInput {
  id: string;
  role: string;
}

async function changeRole({
  id,
  role,
}: ChangeRoleInput): Promise<UserListItem> {
  const res = await fetch(`/api/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể đổi vai trò");
  }

  return res.json();
}

export function useChangeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã đổi vai trò người dùng" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
