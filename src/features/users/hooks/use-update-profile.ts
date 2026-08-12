import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authRequest } from "@/lib/auth-request";

interface UpdateProfileInput {
  name: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const result = await authRequest({
        url: "/api/users/me",
        method: "PATCH",
        body: input,
        successMessage: "Cập nhật thông tin thành công.",
      });
      if (!result.ok) throw new Error();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
