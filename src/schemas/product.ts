import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),

  sku: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã SKU")
    .max(100, "Mã SKU không được vượt quá 100 ký tự"),

  description: z.string().trim().optional(),

  price: z
    .number({ error: "Vui lòng nhập giá bán" })
    .min(0, "Giá bán phải lớn hơn hoặc bằng 0"),

  discountPercent: z
    .number()
    .min(0, "Phần trăm giảm giá phải lớn hơn hoặc bằng 0")
    .max(99, "Phần trăm giảm giá phải nhỏ hơn 100")
    .optional(),

  categoryId: z.uuid("ID danh mục không hợp lệ"),

  status: z.enum(["DRAFT", "ACTIVE"]),
});

export const materialSchema = z.object({
  label: z.string().min(1, "Nhập tên chất liệu"),
  value: z.string().min(1, "Nhập mô tả chất liệu"),
});

export const generalInfoSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  sku: z.string().min(1, "Vui lòng nhập mã SKU"),
  description: z.string().optional(),
  price: z
    .number({ message: "Vui lòng nhập giá" })
    .positive("Giá phải lớn hơn 0"),
  discountPercent: z
    .number()
    .min(0)
    .max(99)
    .optional()
    .or(z.nan().transform(() => undefined)),
  length: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  width: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  height: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  materials: z.array(materialSchema),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;

export const variantSchema = z.object({
  name: z.string().min(1, "Nhập tên biến thể (VD: Xám tro / 120x60cm)"),
  colorHex: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Mã màu không hợp lệ")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  priceOverride: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  stock: z.number({ message: "Nhập số lượng tồn kho" }).int().min(0),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export function generateSku(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SP-${timestamp}-${random}`;
}

export function calculateCompareAtPrice(
  price: number,
  discountPercent: number | undefined,
): number | undefined {
  if (!discountPercent || discountPercent <= 0) return undefined;
  return Math.round(price / (1 - discountPercent / 100));
}
