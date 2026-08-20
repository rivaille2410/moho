import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(255, "Tên danh mục không được vượt quá 255 ký tự"),

  parentId: z.uuid("ID danh mục cha không hợp lệ").optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.uuid("ID danh mục không hợp lệ"),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
