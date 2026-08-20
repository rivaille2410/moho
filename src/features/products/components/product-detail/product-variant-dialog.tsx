"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Boxes, DollarSign } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
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
  useAddVariant,
  useUpdateVariant,
} from "@/features/products/hooks/use-product-variants";
import { type ProductVariant } from "@/types/product";
import { variantSchema, type VariantFormValues } from "@/schemas/product";

interface Props {
  open: boolean;
  productId: string;
  variant?: ProductVariant | null;
  onOpenChange: (open: boolean) => void;
}

function toDefaultValues(variant?: ProductVariant | null): VariantFormValues {
  return {
    name: variant?.name ?? "",
    stock: variant?.stock ?? 0,
    colorHex: variant?.colorHex ?? undefined,
    priceOverride: variant?.priceOverride ?? undefined,
  };
}

export function ProductVariantDialog({
  open,
  variant,
  productId,
  onOpenChange,
}: Props) {
  const isEdit = !!variant;
  const addVariant = useAddVariant();
  const updateVariant = useUpdateVariant();
  const isPending = addVariant.isPending || updateVariant.isPending;

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: toDefaultValues(variant),
  });

  useEffect(() => {
    if (open) form.reset(toDefaultValues(variant));
  }, [open, variant?.id]);

  const onSubmit = (values: VariantFormValues) => {
    const payload = {
      name: values.name,
      colorHex: values.colorHex ?? null,
      priceOverride: values.priceOverride ?? null,
      stock: values.stock,
    };

    if (isEdit && variant) {
      updateVariant.mutate(
        { productId, variantId: variant.id, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      addVariant.mutate(
        { productId, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa biến thể" : "Thêm biến thể"}</DialogTitle>
          <DialogDescription>
            VD: màu sắc, kích thước khác nhau của cùng một sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Tên biến thể</FieldLabel>
              <Input
                startIcon={<Package />}
                placeholder="VD: Xám tro / 120x60cm"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Mã màu (không bắt buộc)</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    className="h-9 w-12 p-1"
                    value={form.watch("colorHex") ?? "#000000"}
                    onChange={(e) =>
                      form.setValue("colorHex", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Input placeholder="#RRGGBB" {...form.register("colorHex")} />
                </div>
                {form.formState.errors.colorHex && (
                  <FieldError>
                    {form.formState.errors.colorHex.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Tồn kho</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  startIcon={<Boxes />}
                  placeholder="0"
                  {...form.register("stock", { valueAsNumber: true })}
                />
                {form.formState.errors.stock && (
                  <FieldError>{form.formState.errors.stock.message}</FieldError>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Giá riêng (không bắt buộc)</FieldLabel>
              <Input
                type="number"
                startIcon={<DollarSign />}
                placeholder="Để trống nếu dùng giá gốc sản phẩm"
                {...form.register("priceOverride", { valueAsNumber: true })}
              />
              {form.formState.errors.priceOverride && (
                <FieldError>
                  {form.formState.errors.priceOverride.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="size-4" />}
              {isPending
                ? "Đang lưu..."
                : isEdit
                  ? "Lưu thay đổi"
                  : "Thêm biến thể"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
