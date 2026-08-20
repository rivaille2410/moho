"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { Plus, FolderTree } from "lucide-react";
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
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/schemas/category";
import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { CategoryTreeItemLabel } from "./category-tree-item-label";
import { useCreateCategory } from "@/features/categories/hooks/use-create-category";

function buildDefaultValues(): CreateCategoryFormValues {
  return {
    name: "",
    parentId: undefined,
  };
}

interface CreateCategoryDialogProps {
  onCreated?: () => void;
}

export function CreateCategoryDialog({ onCreated }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const createCategory = useCreateCategory();

  const { data: categoryTree } = useCategoryTree();
  const flatCategories = flattenCategoryTree(categoryTree ?? []);
  const parentItems = flatCategories.map((c) => ({
    label: `${"  ".repeat(c.depth)}${c.name}`,
    value: c.id,
    item: c,
  }));

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: buildDefaultValues(),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildDefaultValues());
    } else {
      createCategory.reset();
    }
  };

  const onSubmit = (values: CreateCategoryFormValues) => {
    createCategory.mutate(values, {
      onSuccess: () => {
        handleOpenChange(false);
        onCreated?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            Thêm danh mục
          </Button>
        }
      />

      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Danh mục dùng để phân loại sản phẩm. Bạn có thể tạo danh mục con
            bằng cách chọn danh mục cha. Mã slug sẽ được hệ thống tự sinh từ tên
            danh mục.
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
                  Chưa có danh mục nào khác, danh mục này sẽ là danh mục gốc.
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
              disabled={createCategory.isPending}
            >
              {createCategory.isPending && <Spinner className="size-4" />}
              {createCategory.isPending ? "Đang tạo..." : "Tạo danh mục"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
