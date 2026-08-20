"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { FolderTree } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  updateCategorySchema,
  type UpdateCategoryFormValues,
} from "@/schemas/category";
import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { type CategoryListItem } from "@/types/category";
import { CategoryTreeItemLabel } from "./category-tree-item-label";
import { useUpdateCategory } from "@/features/categories/hooks/use-update-category";

interface UpdateCategoryDialogProps {
  category: CategoryListItem | null;
  onOpenChange: (open: boolean) => void;
}

function buildDefaultValues(
  category: CategoryListItem | null,
): UpdateCategoryFormValues {
  return {
    id: category?.id ?? "",
    name: category?.name ?? "",
    parentId: category?.parentId ?? undefined,
  };
}

export function UpdateCategoryDialog({
  category,
  onOpenChange,
}: UpdateCategoryDialogProps) {
  const updateCategory = useUpdateCategory();

  const { data: categoryTree } = useCategoryTree();
  const parentItems = flattenCategoryTree(categoryTree ?? [])
    // không cho chọn chính nó làm cha của nó
    .filter((c) => c.id !== category?.id)
    .map((c) => ({
      label: `${"  ".repeat(c.depth)}${c.name}`,
      value: c.id,
      item: c,
    }));

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: buildDefaultValues(category),
  });

  useEffect(() => {
    if (category) {
      form.reset(buildDefaultValues(category));
    }
  }, [category, form]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      updateCategory.reset();
    }
  };

  const onSubmit = (values: UpdateCategoryFormValues) => {
    const { id, ...input } = values;

    updateCategory.mutate(
      { id, input },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!category} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin danh mục. Thay đổi danh mục cha sẽ ảnh hưởng đến
            cây danh mục hiện tại.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Tên danh mục</FieldLabel>
              <Input
                startIcon={<FolderTree />}
                placeholder="Nhập tên danh mục"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Danh mục cha — không bắt buộc</FieldLabel>
              {parentItems.length === 0 ? (
                <FieldDescription>
                  Không có danh mục nào khác để chọn làm cha.
                </FieldDescription>
              ) : (
                <Select
                  items={parentItems}
                  value={form.watch("parentId") ?? ""}
                  onValueChange={(value: string | null) =>
                    form.setValue("parentId", value ?? undefined, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Không có danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentItems.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <CategoryTreeItemLabel item={p.item} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {form.formState.errors.parentId && (
                <FieldError>
                  {form.formState.errors.parentId.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button
              size={"lg"}
              type="submit"
              disabled={updateCategory.isPending}
            >
              {updateCategory.isPending && <Spinner className="size-4" />}
              {updateCategory.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
