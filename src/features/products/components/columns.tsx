"use client";

import Link from "next/link";
import Image from "next/image";

import { createColumnHelper } from "@tanstack/react-table";
import { Copy, Trash2, PenLine, MoreHorizontal, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ProductListItem } from "@/types/product";

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, ProductListItem>();

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  ACTIVE: "Đang bán",
  ARCHIVED: "Ngừng bán",
};

const statusStyle: Record<string, string> = {
  DRAFT: "border-muted-foreground/20 bg-muted text-muted-foreground",
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  ARCHIVED: "border-destructive/20 bg-destructive/10 text-destructive",
};

interface ColumnsOptions {
  onEdit: (product: ProductListItem) => void;
  onDelete: (product: ProductListItem) => void;
  onChangeStatus: (product: ProductListItem, status: string) => void;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID sản phẩm" });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export const getColumns = ({
  onEdit,
  onDelete,
  onChangeStatus,
}: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Chọn tất cả"
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Chọn dòng"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),

    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sản phẩm" />
      ),
      cell: ({ row }) => {
        const product = row.original;
        const thumbnail =
          product.images.find((img) => img.isThumbnail)?.url ??
          product.images[0]?.url;

        return (
          <Link
            href={`/dashboard/products/${product.id}`}
            className="flex items-center gap-3 group/product-link"
          >
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageOff className="size-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium line-clamp-1 group-hover/product-link:text-secondary transition">
                {product.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {product.sku}
              </span>
            </div>
          </Link>
        );
      },
    }),

    columnHelper.accessor("price", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giá" />
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-secondary">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        );
      },
    }),

    columnHelper.accessor("totalStock", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tồn kho" />
      ),
      cell: ({ row }) => {
        const stock = row.getValue("totalStock") as number;
        return (
          <span className={cn(stock === 0 && "text-destructive font-medium")}>
            {stock}
          </span>
        );
      },
    }),

    columnHelper.accessor("soldCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đã bán" />
      ),
      cell: ({ row }) => <span>{row.getValue("soldCount")}</span>,
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="outline"
            className={cn("font-medium", statusStyle[status])}
          >
            {statusLabel[status] ?? status}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size={"icon-lg"} variant="ghost">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleCopyId(product.id)}>
                  <Copy />
                  Copy ID sản phẩm
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <PenLine />
                  Chỉnh sửa
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Đổi trạng thái
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(["DRAFT", "ACTIVE", "ARCHIVED"] as const)
                      .filter((status) => status !== product.status)
                      .map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onChangeStatus(product, status)}
                        >
                          {statusLabel[status]}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 />
                  Xoá sản phẩm
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
