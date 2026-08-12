import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type UserListItem } from "./use-users";

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_BAN_SELF: "Bạn không thể tự khoá tài khoản của mình.",
  CANNOT_BAN_ADMIN: "Không thể khoá tài khoản quản trị viên.",
  ALREADY_BANNED: "Người dùng này đã bị khoá.",
};

async function banUser(id: string): Promise<UserListItem> {
  const res = await fetch(`/api/users/${id}/ban`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể khoá tài khoản";
    throw new Error(message);
  }

  return res.json();
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Đã khoá tài khoản người dùng",
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
