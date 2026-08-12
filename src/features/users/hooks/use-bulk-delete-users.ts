import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface BulkDeleteResponse {
  deletedCount: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_DELETE_SELF: "Bạn không thể tự xoá tài khoản của mình.",
  CANNOT_DELETE_ADMIN: "Không thể xoá tài khoản quản trị viên.",
  USERS_NOT_FOUND: "Một số người dùng không tồn tại.",
};

async function bulkDeleteUsers(ids: string[]): Promise<BulkDeleteResponse> {
  const res = await fetch("/api/users/bulk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá người dùng";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteUsers,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${data.deletedCount} người dùng`,
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
