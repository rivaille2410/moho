"use client";

import Link from "next/link";

import { ArrowLeft, Boxes, ShoppingBag } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import { ProductListItem, ProductStatus } from "@/types/product";
import { useUpdateProductStatus } from "@/features/products/hooks/use-update-product-status";

const statusItems: { label: string; value: ProductStatus }[] = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Ngừng bán", value: "ARCHIVED" },
];

interface Props {
  product: ProductListItem;
}

export function ProductDetailHeader({ product }: Props) {
  const updateStatus = useUpdateProductStatus();

  return (
    <div className="flex flex-col gap-4 border-b pb-4">
      <Link
        href="/dashboard/products"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>SKU: {product.sku}</span>
            <span className="flex items-center gap-1">
              <Boxes className="size-3.5" />
              {product.totalStock} tồn kho
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="size-3.5" />
              Đã bán {product.soldCount}
            </span>
          </div>
        </div>

        <Select
          items={statusItems}
          value={product.status}
          onValueChange={(value) =>
            value &&
            updateStatus.mutate({
              id: product.id,
              status: value as ProductStatus,
            })
          }
        >
          <SelectTrigger className="w-44">
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
      </div>
    </div>
  );
}
