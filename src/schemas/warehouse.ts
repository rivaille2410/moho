import { z } from "zod";

import { Warehouse } from "@/types/warehouse";

export const warehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên kho hàng phải có ít nhất 2 ký tự")
    .max(200, "Tên kho hàng không được vượt quá 200 ký tự"),

  provinceCode: z.number().optional(),
  wardCode: z.number().optional(),
  addressDetail: z
    .string()
    .trim()
    .max(300, "Địa chỉ cụ thể không được vượt quá 300 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  isMain: z.boolean(),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export function buildDefaultWarehouseValues(
  warehouse?: Partial<Warehouse>,
): WarehouseFormValues {
  return {
    name: warehouse?.name ?? "",
    provinceCode: warehouse?.provinceCode ?? undefined,
    wardCode: warehouse?.wardCode ?? undefined,
    addressDetail: warehouse?.addressDetail ?? "",
    isMain: warehouse?.isMain ?? false,
  };
}
