"use client";

import { createColumnHelper } from "@tanstack/react-table";
import {
  Copy,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Banknote,
  QrCode,
} from "lucide-react";

import { type Order } from "@/types/order";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, Order>();

interface ColumnsOptions {
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

function handleCopyId(id: string, label: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: `Đã sao chép ${label}` });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const paymentMethodConfig: Record<
  Order["paymentMethod"],
  { label: string; icon: React.ReactNode }
> = {
  COD: { label: "COD", icon: <Banknote className="size-3" /> },
  BANK_TRANSFER: {
    label: "Chuyển khoản",
    icon: <QrCode className="size-3" />,
  },
};

export const getColumns = ({ onView, onUpdateStatus }: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.accessor("orderNumber", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã đơn" />
      ),
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="font-medium hover:text-secondary transition"
        >
          {row.getValue("orderNumber")}
        </button>
      ),
    }),

    columnHelper.accessor("recipientName", {
      header: "Người đặt",
      cell: ({ row }) => {
        const { recipientName, recipientPhone, user } = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              {user.avatar && (
                <AvatarImage src={user.avatar} alt={recipientName} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(recipientName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium line-clamp-1">{recipientName}</span>
              <span className="text-xs text-muted-foreground">
                {recipientPhone}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => <OrderStatusBadge status={row.getValue("status")} />,
    }),

    columnHelper.accessor("paymentMethod", {
      header: "Thanh toán",
      cell: ({ row }) => {
        const method =
          paymentMethodConfig[
            row.getValue<Order["paymentMethod"]>("paymentMethod")
          ];
        return (
          <Badge variant="outline" className="gap-1 font-normal">
            {method.icon}
            {method.label}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("total", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tổng tiền" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-secondary">
          {formatCurrency(row.getValue("total"))}
        </span>
      ),
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày đặt" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

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
                <DropdownMenuItem
                  onClick={() => handleCopyId(order.id, "ID đơn hàng")}
                >
                  <Copy />
                  Copy ID đơn hàng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(order)}>
                  <Eye />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                  <RefreshCw />
                  Cập nhật trạng thái
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
