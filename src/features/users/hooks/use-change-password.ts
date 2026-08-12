import { useMutation } from "@tanstack/react-query";

import { authRequest } from "@/lib/auth-request";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      const result = await authRequest({
        url: "/api/users/me/password",
        method: "PATCH",
        body: input,
        successMessage: "Cập nhật mật khẩu thành công.",
        errorMessages: {
          INVALID_PASSWORD: "Mật khẩu hiện tại không đúng.",
          SAME_PASSWORD: "Mật khẩu mới phải khác mật khẩu hiện tại.",
          NO_PASSWORD_SET:
            "Tài khoản này đăng nhập bằng Google, chưa đặt mật khẩu.",
        },
      });
      if (!result.ok) throw new Error();
      return result.data;
    },
  });
}
