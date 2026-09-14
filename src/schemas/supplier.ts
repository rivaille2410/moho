import { z } from "zod";

import { Supplier } from "@/types/supplier";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_REGEX = /^\d{9}$/;

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên nhà cung cấp phải có ít nhất 2 ký tự")
    .max(200, "Tên nhà cung cấp không được vượt quá 200 ký tự"),

  contactName: z
    .string()
    .trim()
    .max(100, "Tên người liên hệ không được vượt quá 100 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  phone: z
    .string()
    .regex(PHONE_DIGITS_REGEX, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  email: z
    .string()
    .trim()
    .regex(EMAIL_REGEX, "Email không đúng định dạng")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  provinceCode: z.number().optional(),
  wardCode: z.number().optional(),
  addressDetail: z
    .string()
    .trim()
    .max(300, "Địa chỉ cụ thể không được vượt quá 300 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  note: z
    .string()
    .trim()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export function buildDefaultSupplierValues(
  supplier?: Partial<Supplier>,
): SupplierFormValues {
  return {
    name: supplier?.name ?? "",
    contactName: supplier?.contactName ?? "",
    phone: supplier?.phone ?? "",
    email: supplier?.email ?? "",
    provinceCode: supplier?.provinceCode ?? undefined,
    wardCode: supplier?.wardCode ?? undefined,
    addressDetail: supplier?.addressDetail ?? "",
    note: supplier?.note ?? "",
  };
}
