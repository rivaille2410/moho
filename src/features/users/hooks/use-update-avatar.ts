import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authRequest } from "@/lib/auth-request";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await authRequest({
        url: "/api/users/me/avatar",
        method: "PATCH",
        body: formData,
        successMessage: "Cập nhật ảnh đại diện thành công.",
      });
      if (!result.ok) throw new Error();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
