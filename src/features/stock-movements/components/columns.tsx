"use client";

import Link from "next/link";
import Image from "next/image";

import { ImageOff } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { type StockMovement } from "@/types/stock-movement";
import { StockMovementTypeBadge } from "./stock-movement-type-badge";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, StockMovement>();

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const getColumns = () =>
  columnHelper.columns([
    columnHelper.accessor("productName", {
      header: "Sản phẩm",
      cell: ({ row }) => {
        const movement = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-md border bg-muted">
              {movement.imageUrl ? (
                <Image
                  src={movement.imageUrl}
                  alt={movement.productName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ImageOff className="size-4 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <Link
                href={`/dashboard/products/${movement.productId}`}
                className="font-medium hover:text-secondary transition"
              >
                {movement.productName}
              </Link>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {movement.colorHex && (
                  <span
                    className="size-2.5 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: movement.colorHex }}
                  />
                )}
                {movement.variantName}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("warehouseName", {
      header: "Kho hàng",
      cell: ({ row }) => {
        const movement = row.original;
        return (
          <Link
            href={`/dashboard/warehouses/${movement.warehouseId}`}
            className="hover:text-secondary transition"
          >
            {movement.warehouseName}
          </Link>
        );
      },
    }),

    columnHelper.accessor("type", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại" />
      ),
      cell: ({ row }) => <StockMovementTypeBadge type={row.getValue("type")} />,
    }),

    columnHelper.accessor("quantity", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số lượng" />
      ),
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;
        return (
          <span
            className={
              quantity > 0
                ? "font-medium text-green-600"
                : "font-medium text-destructive"
            }
          >
            {quantity > 0 ? `+${quantity}` : quantity}
          </span>
        );
      },
    }),

    columnHelper.accessor("note", {
      header: "Ghi chú",
      cell: ({ row }) => (
        <span className="line-clamp-1 text-muted-foreground">
          {row.getValue("note") ?? "—"}
        </span>
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thời gian" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    }),
  ]);
