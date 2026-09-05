import { z } from "zod";

const voucherBaseSchema = z.object({
  code: z
    .string()
    .min(3, "Mã voucher phải có ít nhất 3 ký tự")
    .max(30, "Mã voucher tối đa 30 ký tự")
    .regex(/^[A-Za-z0-9_-]+$/, "Mã chỉ gồm chữ, số, gạch ngang hoặc gạch dưới"),
  name: z.string().min(1, "Vui lòng nhập tên voucher"),
  description: z.string().optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().positive("Giá trị phải lớn hơn 0"),
  maxDiscount: z.coerce.number().positive().optional(),
  minOrderValue: z.coerce.number().min(0).optional(),
  scope: z.enum(["ALL", "CATEGORY", "PRODUCT"]),
  categoryIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  usageLimitPerUser: z.coerce.number().int().positive().optional(),
  startAt: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endAt: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  isPublic: z.boolean().optional(),
});

type RefinableShape = {
  type: z.ZodEnum<{ PERCENT: "PERCENT"; FIXED: "FIXED" }>;
  value: z.ZodType<number, any, any>;
  startAt: z.ZodString;
  endAt: z.ZodString;
};

type RefineInput = {
  type: "PERCENT" | "FIXED";
  value: number;
  startAt: string;
  endAt: string;
};

function withDateAndPercentRefine<
  Shape extends RefinableShape,
  T extends z.ZodObject<Shape>,
>(schema: T) {
  return schema
    .refine(
      (data) => {
        const d = data as unknown as RefineInput;
        return new Date(d.startAt) < new Date(d.endAt);
      },
      { message: "Ngày bắt đầu phải trước ngày kết thúc", path: ["endAt"] },
    )
    .refine(
      (data) => {
        const d = data as unknown as RefineInput;
        return d.type !== "PERCENT" || d.value <= 100;
      },
      { message: "Giá trị phần trăm không được vượt quá 100", path: ["value"] },
    );
}

export const createVoucherSchema = withDateAndPercentRefine(voucherBaseSchema)
  .refine(
    (data) =>
      data.scope !== "CATEGORY" ||
      (data.categoryIds && data.categoryIds.length > 0),
    { message: "Vui lòng chọn ít nhất 1 danh mục", path: ["categoryIds"] },
  )
  .refine(
    (data) =>
      data.scope !== "PRODUCT" ||
      (data.productIds && data.productIds.length > 0),
    { message: "Vui lòng chọn ít nhất 1 sản phẩm", path: ["productIds"] },
  );

export type CreateVoucherFormValues = z.input<typeof createVoucherSchema>;
export type CreateVoucherFormOutput = z.output<typeof createVoucherSchema>;

export const updateVoucherSchema = withDateAndPercentRefine(
  voucherBaseSchema.omit({ code: true, scope: true }),
);
export type UpdateVoucherFormValues = z.input<typeof updateVoucherSchema>;
export type UpdateVoucherFormOutput = z.output<typeof updateVoucherSchema>;

export function buildDefaultVoucherValues(): CreateVoucherFormValues {
  return {
    code: "",
    name: "",
    description: "",
    type: "PERCENT",
    value: 0,
    maxDiscount: undefined,
    minOrderValue: 0,
    scope: "ALL",
    categoryIds: [],
    productIds: [],
    usageLimit: undefined,
    usageLimitPerUser: 1,
    startAt: "",
    endAt: "",
    isPublic: true,
  };
}
