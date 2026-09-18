"use client";

import Link from "next/link";

import {
  Copy,
  Flag,
  Wallet,
  XCircle,
  CheckCircle2,
  PackageCheck,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  statusLabel,
  statusStyle,
  statusIcon,
  reasonLabel,
} from "@/features/return-requests/utils/return-request-status";
import { type ReturnRequestListItem } from "@/types/return-request";

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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<
  DataTableFeatures,
  ReturnRequestListItem
>();

interface ColumnsOptions {
  onApprove: (item: ReturnRequestListItem) => void;
  onReject: (item: ReturnRequestListItem) => void;
  onMarkReceived: (item: ReturnRequestListItem) => void;
  onProcessRefund: (item: ReturnRequestListItem) => void;
  onComplete: (item: ReturnRequestListItem) => void;
}

function handleCopyCode(code: string) {
  navigator.clipboard.writeText(code);
  toast.add({ type: "success", description: "Đã sao chép mã yêu cầu" });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

export const getColumns = ({
  onApprove,
  onReject,
  onMarkReceived,
  onProcessRefund,
  onComplete,
}: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.accessor("code", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã yêu cầu" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            href={`/dashboard/return-requests/${item.id}`}
            className="flex flex-col hover:text-secondary transition"
          >
            <span className="font-medium">{item.code}</span>
            <span className="text-xs text-muted-foreground">
              Đơn {item.orderNumber}
            </span>
          </Link>
        );
      },
    }),

    columnHelper.accessor("customerName", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Khách hàng" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9">
              <AvatarImage
                src={item.customerAvatar ?? undefined}
                alt={item.customerName}
              />
              <AvatarFallback>
                {item.customerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {item.customerName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {item.customerEmail}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("reason", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lý do" />
      ),
      cell: ({ row }) => {
        const reason = row.getValue("reason") as string;
        return <span>{reasonLabel[reason] ?? reason}</span>;
      },
    }),

    columnHelper.accessor("refundAmount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số tiền hoàn" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-secondary">
          {formatPrice(row.getValue("refundAmount"))}
        </span>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const Icon = statusIcon[status];
        return (
          <Badge
            variant="outline"
            className={cn("gap-1 font-medium", statusStyle[status])}
          >
            {Icon ? <Icon className="size-3.5" /> : null}
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
        const item = row.original;

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
                <DropdownMenuItem onClick={() => handleCopyCode(item.code)}>
                  <Copy />
                  Copy mã yêu cầu
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {item.status === "PENDING" && (
                  <>
                    <DropdownMenuItem onClick={() => onApprove(item)}>
                      <CheckCircle2 />
                      Duyệt yêu cầu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onReject(item)}
                    >
                      <XCircle />
                      Từ chối
                    </DropdownMenuItem>
                  </>
                )}

                {item.status === "APPROVED" && (
                  <DropdownMenuItem onClick={() => onMarkReceived(item)}>
                    <PackageCheck />
                    Xác nhận đã nhận hàng
                  </DropdownMenuItem>
                )}

                {item.status === "ITEM_RECEIVED" && (
                  <DropdownMenuItem onClick={() => onProcessRefund(item)}>
                    <Wallet />
                    Xử lý hoàn tiền
                  </DropdownMenuItem>
                )}

                {item.status === "REFUNDED" && (
                  <DropdownMenuItem onClick={() => onComplete(item)}>
                    <Flag />
                    Hoàn tất yêu cầu
                  </DropdownMenuItem>
                )}

                {["REJECTED", "COMPLETED", "CANCELLED"].includes(
                  item.status,
                ) && (
                  <DropdownMenuItem disabled>
                    Không còn hành động khả dụng
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
