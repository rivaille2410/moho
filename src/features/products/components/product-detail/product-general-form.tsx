"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, DollarSign, Percent, Ruler } from "lucide-react";

import {
  generalInfoSchema,
  calculateCompareAtPrice,
  type GeneralInfoFormValues,
} from "@/schemas/product";
import { type ProductListItem } from "@/types/product";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { useUpdateProduct } from "@/features/products/hooks/use-update-product";
import { CategoryTreeItemLabel } from "@/features/categories/components/category-tree-item-label";

const statusItems = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Ngừng bán", value: "ARCHIVED" },
];

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function toDefaultValues(product: ProductListItem): GeneralInfoFormValues {
  const price = product.price;
  const compareAtPrice = product.compareAtPrice ?? undefined;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : undefined;

  return {
    name: product.name,
    sku: product.sku,
    description: product.description ?? "",
    price,
    discountPercent,
    length: product.length ?? undefined,
    width: product.width ?? undefined,
    height: product.height ?? undefined,
    categoryId: product.categoryId,
    status: product.status,
    materials: product.materials.map((m) => ({
      label: m.label,
      value: m.value,
    })),
  };
}

interface Props {
  product: ProductListItem;
}

export function ProductGeneralForm({ product }: Props) {
  const updateProduct = useUpdateProduct();
  const { data: categoryTree } = useCategoryTree();
  const flatCategories = flattenCategoryTree(categoryTree ?? []);
  const categoryItems = flatCategories.map((c) => ({
    label: `${"  ".repeat(c.depth)}${c.name}`,
    value: c.id,
    item: c,
  }));

  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: toDefaultValues(product),
  });

  useEffect(() => {
    form.reset(toDefaultValues(product));
  }, [product.id, product.updatedAt]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const price = form.watch("price");
  const discountPercent = form.watch("discountPercent");
  const compareAtPrice = calculateCompareAtPrice(price, discountPercent);

  const onSubmit = (values: GeneralInfoFormValues) => {
    const { discountPercent, materials, ...rest } = values;

    updateProduct.mutate({
      id: product.id,
      payload: {
        ...rest,
        compareAtPrice:
          calculateCompareAtPrice(rest.price, discountPercent) ?? null,
        materials: materials.map((m, i) => ({ ...m, sortOrder: i })),
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Tên sản phẩm</FieldLabel>
            <Input placeholder="Nhập tên sản phẩm" {...form.register("name")} />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Mã SKU</FieldLabel>
            <Input placeholder="Mã SKU" {...form.register("sku")} />
            {form.formState.errors.sku && (
              <FieldError>{form.formState.errors.sku.message}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Giá bán</FieldLabel>
            <Input
              type="number"
              startIcon={<DollarSign />}
              placeholder="0"
              {...form.register("price", { valueAsNumber: true })}
            />
            {form.formState.errors.price && (
              <FieldError>{form.formState.errors.price.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Giảm giá (%) — không bắt buộc</FieldLabel>
            <Input
              type="number"
              min={0}
              max={99}
              startIcon={<Percent />}
              placeholder="0"
              {...form.register("discountPercent", { valueAsNumber: true })}
            />
            {form.formState.errors.discountPercent ? (
              <FieldError>
                {form.formState.errors.discountPercent.message}
              </FieldError>
            ) : (
              compareAtPrice !== undefined && (
                <FieldDescription>
                  Giá gạch ngang sẽ hiển thị:{" "}
                  <span className="font-medium text-foreground">
                    {formatPrice(compareAtPrice)}
                  </span>
                </FieldDescription>
              )
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel>Dài (cm)</FieldLabel>
            <Input
              type="number"
              startIcon={<Ruler />}
              placeholder="—"
              {...form.register("length", { valueAsNumber: true })}
            />
          </Field>
          <Field>
            <FieldLabel>Rộng (cm)</FieldLabel>
            <Input
              type="number"
              startIcon={<Ruler />}
              placeholder="—"
              {...form.register("width", { valueAsNumber: true })}
            />
          </Field>
          <Field>
            <FieldLabel>Cao (cm)</FieldLabel>
            <Input
              type="number"
              startIcon={<Ruler />}
              placeholder="—"
              {...form.register("height", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Danh mục</FieldLabel>
          <Select
            items={categoryItems}
            value={form.watch("categoryId")}
            onValueChange={(value: string | null) =>
              form.setValue("categoryId", value ?? "", { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categoryItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <CategoryTreeItemLabel item={item.item} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId && (
            <FieldError>{form.formState.errors.categoryId.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Mô tả</FieldLabel>
          <RichTextEditor
            value={form.watch("description") ?? ""}
            onChange={(html) =>
              form.setValue("description", html, { shouldValidate: true })
            }
            placeholder="Nhập mô tả sản phẩm..."
          />
          {form.formState.errors.description && (
            <FieldError>{form.formState.errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Trạng thái</FieldLabel>
          <Select
            items={statusItems}
            value={form.watch("status")}
            onValueChange={(value) =>
              value &&
              form.setValue("status", value as GeneralInfoFormValues["status"])
            }
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <div className="mb-1 flex items-center justify-between">
            <FieldLabel>Chất liệu</FieldLabel>
            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={() => append({ label: "", value: "" })}
            >
              <Plus className="size-4" />
              Thêm chất liệu
            </Button>
          </div>

          {fields.length === 0 && (
            <FieldDescription>
              Chưa có thông tin chất liệu nào.
            </FieldDescription>
          )}

          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  placeholder="VD: Khung"
                  className="w-40"
                  {...form.register(`materials.${index}.label`)}
                />
                <Input
                  placeholder="VD: Gỗ sồi tự nhiên"
                  className="flex-1"
                  {...form.register(`materials.${index}.value`)}
                />
                <Button
                  type="button"
                  size="icon-lg"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateProduct.isPending}>
          {updateProduct.isPending && <Spinner className="size-4" />}
          {updateProduct.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
