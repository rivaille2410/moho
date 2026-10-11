import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authRequest } from "@/lib/auth-request";
import { queryKeys } from "@/lib/query-keys";
import type { CurrentUser } from "@/features/auth/hooks/use-current-user";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await authRequest<CurrentUser>({
        url: "/api/users/me/avatar",
        method: "PATCH",
        body: formData,
        successMessage: "Cập nhật ảnh đại diện thành công.",
      });
      if (!result.ok) throw new Error();
      return result.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.me(), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
