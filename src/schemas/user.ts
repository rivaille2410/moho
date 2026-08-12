import z from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được vượt quá 50 ký tự")
    .regex(/^[\p{L}\s]+$/u, "Họ và tên chỉ được chứa chữ cái và khoảng trắng")
    .regex(
      /^(?!.*\s{2,}).*$/,
      "Họ và tên không được chứa khoảng trắng liên tiếp",
    ),
  email: z.string().trim().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(72, "Mật khẩu không được vượt quá 72 ký tự")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
