"use client";

import Link from "next/link";

import {
  Eye,
  Copy,
  RefreshCw,
  PackageCheck,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { type PurchaseOrder } from "@/types/purchase-order";

import { PurchaseOrderStatusBadge } from "./status-badge";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, PurchaseOrder>();

interface ColumnsOptions {
  onView: (po: PurchaseOrder) => void;
  onUpdateStatus: (po: PurchaseOrder) => void;
  onReceive: (po: PurchaseOrder) => void;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID đơn nhập hàng" });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({
  onView,
  onUpdateStatus,
  onReceive,
}: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.accessor("code", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã đơn" />
      ),
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="font-medium hover:text-secondary transition"
        >
          {row.getValue("code")}
        </button>
      ),
    }),

    columnHelper.accessor((row) => row.supplier.name, {
      id: "supplier",
      header: "Nhà cung cấp",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/suppliers/${row.original.supplier.id}`}
          className="hover:text-secondary transition"
        >
          {row.original.supplier.name}
        </Link>
      ),
    }),

    columnHelper.accessor((row) => row.warehouse.name, {
      id: "warehouse",
      header: "Kho hàng",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/warehouses/${row.original.warehouse.id}`}
          className="hover:text-secondary transition"
        >
          {row.original.warehouse.name}
        </Link>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => (
        <PurchaseOrderStatusBadge status={row.getValue("status")} />
      ),
    }),

    columnHelper.accessor("expectedAt", {
      header: "Ngày dự kiến",
      cell: ({ row }) => <span>{formatDate(row.getValue("expectedAt"))}</span>,
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
        const po = row.original;
        const canUpdateStatus =
          po.status === "DRAFT" || po.status === "ORDERED";
        const canReceive =
          po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED";

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
                <DropdownMenuItem onClick={() => handleCopyId(po.id)}>
                  <Copy />
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(po)}>
                  <Eye />
                  Xem chi tiết
                </DropdownMenuItem>
                {canUpdateStatus && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(po)}>
                    <RefreshCw />
                    Cập nhật trạng thái
                  </DropdownMenuItem>
                )}
                {canReceive && (
                  <DropdownMenuItem onClick={() => onReceive(po)}>
                    <PackageCheck />
                    Nhận hàng
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
