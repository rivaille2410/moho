"use client";

import { useState } from "react";

import { Plus, Pencil, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductVariantDialog } from "./product-variant-dialog";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

import { ProductListItem, ProductVariant } from "@/types/product";
import { useRemoveVariant } from "@/features/products/hooks/use-product-variants";

function formatPrice(value: number | null) {
  if (value === null) return null;
  return value.toLocaleString("vi-VN") + "đ";
}

interface Props {
  product: ProductListItem;
}

export function ProductVariantsSection({ product }: Props) {
  const [dialogVariant, setDialogVariant] = useState<
    ProductVariant | null | undefined
  >(undefined);
  const [variantToDelete, setVariantToDelete] = useState<ProductVariant | null>(
    null,
  );

  const removeVariant = useRemoveVariant();

  const handleConfirmDelete = () => {
    if (!variantToDelete) return;
    removeVariant.mutate(
      { productId: product.id, variantId: variantToDelete.id },
      { onSuccess: () => setVariantToDelete(null) },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {product.variants.length === 0
            ? "Sản phẩm chưa có biến thể nào."
            : `${product.variants.length} biến thể · ${product.totalStock} tồn kho`}
        </p>
        <Button size="lg" onClick={() => setDialogVariant(null)}>
          <Plus className="size-4" />
          Thêm biến thể
        </Button>
      </div>

      {product.variants.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Biến thể</th>
                <th className="px-4 py-2.5 font-medium">Màu</th>
                <th className="px-4 py-2.5 font-medium">Giá riêng</th>
                <th className="px-4 py-2.5 font-medium">Tồn kho</th>
                <th className="px-4 py-2.5 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {product.variants.map((variant) => (
                <tr key={variant.id}>
                  <td className="px-4 py-2.5 font-medium">{variant.name}</td>
                  <td className="px-4 py-2.5">
                    {variant.colorHex ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="size-4 rounded-full border"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        {variant.colorHex}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {formatPrice(variant.priceOverride) ?? (
                      <span className="text-muted-foreground">Giá gốc</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {variant.stock === 0 ? (
                      <span className="text-destructive">Hết hàng</span>
                    ) : (
                      variant.stock
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDialogVariant(variant)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setVariantToDelete(variant)}
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductVariantDialog
        productId={product.id}
        open={dialogVariant !== undefined}
        onOpenChange={(open) => !open && setDialogVariant(undefined)}
        variant={dialogVariant}
      />

      <ConfirmActionDialog
        confirmLabel="Xoá"
        icon={<Trash2Icon />}
        variant="destructive"
        pendingLabel="Đang xoá..."
        title="Xoá biến thể?"
        open={!!variantToDelete}
        onConfirm={handleConfirmDelete}
        isPending={removeVariant.isPending}
        onOpenChange={(open) => !open && setVariantToDelete(null)}
        description={
          <>
            Bạn sắp xoá biến thể{" "}
            <span className="font-medium text-foreground">
              {variantToDelete?.name}
            </span>
            . Hành động này không thể hoàn tác.
          </>
        }
      />
    </div>
  );
}
