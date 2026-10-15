import { z } from "zod";

export const addressSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),
  recipientPhone: z.string().regex(/^\d{9}$/, "Số điện thoại không hợp lệ"),
  provinceCode: z
    .number({ message: "Vui lòng chọn tỉnh/thành" })
    .int()
    .positive("Vui lòng chọn tỉnh/thành"),
  wardCode: z
    .number({ message: "Vui lòng chọn phường/xã" })
    .int()
    .positive("Vui lòng chọn phường/xã"),
  addressDetail: z
    .string()
    .trim()
    .min(5, "Vui lòng nhập địa chỉ cụ thể")
    .max(255, "Địa chỉ quá dài"),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
