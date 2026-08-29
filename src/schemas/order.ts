import z from "zod";

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
    phone: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(/^(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ"),
    provinceCode: z.number().optional(),
    wardCode: z.number().optional(),
    addressDetail: z.string().trim().min(1, "Vui lòng nhập địa chỉ cụ thể"),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.provinceCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn tỉnh/thành",
        path: ["provinceCode"],
      });
    }
    if (!data.wardCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn phường/xã",
        path: ["wardCode"],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
