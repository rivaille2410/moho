"use client";

import Link from "next/link";

import { createColumnHelper } from "@tanstack/react-table";
import { Copy, Pencil, Trash2, MoreHorizontal, Star } from "lucide-react";

import { type Warehouse } from "@/types/warehouse";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, Warehouse>();

interface ColumnsOptions {
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID kho hàng" });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({ onEdit, onDelete }: ColumnsOptions) =>
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
        <DataTableColumnHeader column={column} title="Kho hàng" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Link
            href={`/dashboard/warehouses/${row.original.id}`}
            className="font-medium hover:text-secondary transition"
          >
            {row.getValue("name") as string}
          </Link>
          {row.original.isMain && (
            <Star
              aria-label="Kho chính"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            >
              <title>Kho chính</title>
            </Star>
          )}
        </div>
      ),
    }),

    columnHelper.display({
      id: "address",
      header: "Địa chỉ",
      cell: ({ row }) => {
        const w = row.original;
        const full = [w.addressDetail, w.wardName, w.provinceName]
          .filter(Boolean)
          .join(", ");
        return <span className="line-clamp-1">{full || "—"}</span>;
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
        const warehouse = row.original;

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
                <DropdownMenuItem onClick={() => handleCopyId(warehouse.id)}>
                  <Copy />
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                  <Pencil />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(warehouse)}
                >
                  <Trash2 />
                  Xoá
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
