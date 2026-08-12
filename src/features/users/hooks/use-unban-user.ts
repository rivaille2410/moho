import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type UserListItem } from "./use-users";

const ERROR_MESSAGES: Record<string, string> = {
  NOT_BANNED: "Người dùng này chưa bị khoá.",
};

async function unbanUser(id: string): Promise<UserListItem> {
  const res = await fetch(`/api/users/${id}/unban`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể mở khoá tài khoản";
    throw new Error(message);
  }

  return res.json();
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Đã mở khoá tài khoản người dùng",
      });
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
