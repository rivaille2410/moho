"use client";

import { useState } from "react";

import {
  Tag,
  Plus,
  Package,
  Percent,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

import {
  generateSku,
  createProductSchema,
  CreateProductFormValues,
  calculateCompareAtPrice,
} from "@/schemas/product";
import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { useCreateProduct } from "@/features/products/hooks/use-create-product";
import { CategoryTreeItemLabel } from "@/features/categories/components/category-tree-item-label";

const statusItems = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đang bán", value: "ACTIVE" },
];

function buildDefaultValues(): CreateProductFormValues {
  return {
    name: "",
    sku: generateSku(),
    description: "",
    price: 0,
    discountPercent: undefined,
    categoryId: "",
    status: "DRAFT",
  };
}

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);

  const createProduct = useCreateProduct();

  const { data: categoryTree } = useCategoryTree();
  const flatCategories = flattenCategoryTree(categoryTree ?? []);
  const categoryItems = flatCategories.map((c) => ({
    label: `${"  ".repeat(c.depth)}${c.name}`,
    value: c.id,
    item: c,
  }));

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: buildDefaultValues(),
  });

  const price = form.watch("price");
  const discountPercent = form.watch("discountPercent");
  const compareAtPrice = calculateCompareAtPrice(price, discountPercent);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildDefaultValues());
    } else {
      createProduct.reset();
    }
  };

  const handleRegenerateSku = () => {
    form.setValue("sku", generateSku(), { shouldValidate: true });
  };

  const onSubmit = (values: CreateProductFormValues) => {
    const { discountPercent, ...rest } = values;

    createProduct.mutate(
      {
        ...rest,
        compareAtPrice: calculateCompareAtPrice(rest.price, discountPercent),
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            Thêm sản phẩm
          </Button>
        }
      />

      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          <DialogDescription>
            Sau khi tạo, bạn có thể thêm biến thể màu, kích thước, chất liệu và
            ảnh ở trang chi tiết sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Tên sản phẩm</FieldLabel>
              <Input
                startIcon={<Package />}
                placeholder="Nhập tên sản phẩm"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Mã SKU</FieldLabel>
              <div className="flex gap-2">
                <Input
                  startIcon={<Tag />}
                  placeholder="Mã SKU"
                  {...form.register("sku")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  onClick={handleRegenerateSku}
                  title="Tạo mã SKU ngẫu nhiên mới"
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
              <FieldDescription>
                Mã SKU được tạo tự động, bạn có thể chỉnh sửa nếu cần.
              </FieldDescription>
              {form.formState.errors.sku && (
                <FieldError>{form.formState.errors.sku.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
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
                  {...form.register("discountPercent", {
                    valueAsNumber: true,
                  })}
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

            <Field>
              <FieldLabel>Danh mục</FieldLabel>
              {categoryItems.length === 0 ? (
                <>
                  <Select items={[]} disabled value={""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chưa có danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <></>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Chưa có danh mục nào. Vui lòng tạo danh mục trước khi thêm
                    sản phẩm.
                  </FieldDescription>
                </>
              ) : (
                <Select
                  items={categoryItems}
                  value={form.watch("categoryId")}
                  onValueChange={(value: string | null) =>
                    form.setValue("categoryId", value ?? "", {
                      shouldValidate: true,
                    })
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
              )}
              {form.formState.errors.categoryId && (
                <FieldError>
                  {form.formState.errors.categoryId.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Mô tả</FieldLabel>
              <Textarea
                placeholder="Nhập mô tả sản phẩm"
                {...form.register("description")}
              />
            </Field>

            <Field>
              <FieldLabel>Trạng thái</FieldLabel>
              <Select
                items={statusItems}
                value={form.watch("status")}
                onValueChange={(value: string | null) =>
                  form.setValue(
                    "status",
                    (value ?? "DRAFT") as "DRAFT" | "ACTIVE",
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
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
              disabled={createProduct.isPending}
            >
              {createProduct.isPending && <Spinner className="size-4" />}
              {createProduct.isPending ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
