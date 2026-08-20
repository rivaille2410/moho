"use client";

import {
  Copy,
  Trash2,
  PenLine,
  FolderTree,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type CategoryListItem } from "@/types/category";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, CategoryListItem>();

interface ColumnsOptions {
  onEdit: (category: CategoryListItem) => void;
  onDelete: (category: CategoryListItem) => void;
  categoryNameById?: Record<string, string>;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID danh mục" });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({
  onEdit,
  onDelete,
  categoryNameById = {},
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
        <DataTableColumnHeader column={column} title="Tên danh mục" />
      ),
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
              <FolderTree className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium line-clamp-1">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category.slug}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("parentId", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Danh mục cha" />
      ),
      cell: ({ row }) => {
        const parentId = row.original.parentId;
        if (!parentId) {
          return <span className="text-xs text-muted-foreground">— Gốc —</span>;
        }

        return (
          <Badge variant="outline" className="font-normal">
            {categoryNameById[parentId] ?? parentId}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("productCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số sản phẩm" />
      ),
      cell: ({ row }) => <span>{row.getValue("productCount") ?? 0}</span>,
    }),

    columnHelper.accessor("childrenCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Danh mục con" />
      ),
      cell: ({ row }) => <span>{row.getValue("childrenCount") ?? 0}</span>,
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
        const category = row.original;

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
                <DropdownMenuItem onClick={() => handleCopyId(category.id)}>
                  <Copy />
                  Copy ID danh mục
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <PenLine />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={
                    category.childrenCount > 0 || category.productCount > 0
                  }
                  onClick={() => onDelete(category)}
                >
                  <Trash2 />
                  Xoá danh mục
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
