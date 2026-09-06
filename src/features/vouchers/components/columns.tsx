"use client";

import Link from "next/link";

import {
  Ban,
  Copy,
  Clock,
  Trash2,
  PenLine,
  PlayIcon,
  FileEdit,
  PauseIcon,
  TicketPercent,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/currency";
import { type VoucherListItem } from "@/types/voucher";

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

const columnHelper = createColumnHelper<DataTableFeatures, VoucherListItem>();

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  ACTIVE: "Đang chạy",
  PAUSED: "Tạm dừng",
  EXPIRED: "Hết hạn",
  DEPLETED: "Hết lượt",
};

const statusStyle: Record<string, string> = {
  DRAFT: "border-muted-foreground/20 bg-muted text-muted-foreground",
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  PAUSED: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  EXPIRED: "border-destructive/20 bg-destructive/10 text-destructive",
  DEPLETED: "border-destructive/20 bg-destructive/10 text-destructive",
};

const statusIcon: Record<string, React.ElementType> = {
  DRAFT: FileEdit,
  ACTIVE: PlayIcon,
  PAUSED: PauseIcon,
  EXPIRED: Clock,
  DEPLETED: Ban,
};

const scopeLabel: Record<string, string> = {
  ALL: "Toàn shop",
  CATEGORY: "Theo danh mục",
  PRODUCT: "Theo sản phẩm",
};

interface ColumnsOptions {
  onEdit: (voucher: VoucherListItem) => void;
  onDelete: (voucher: VoucherListItem) => void;
  onChangeStatus: (voucher: VoucherListItem, status: string) => void;
}

function handleCopyCode(code: string) {
  navigator.clipboard.writeText(code);
  toast.add({ type: "success", description: "Đã sao chép mã voucher" });
}

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatValue(voucher: VoucherListItem) {
  return voucher.type === "PERCENT"
    ? `${voucher.value}%`
    : formatVND(voucher.value);
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

    columnHelper.accessor("code", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã voucher" />
      ),
      cell: ({ row }) => {
        const voucher = row.original;

        return (
          <Link
            href={`/dashboard/vouchers/${voucher.id}`}
            className="group flex items-center gap-2"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border bg-muted text-muted-foreground">
              <TicketPercent className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm group-hover:text-secondary transition">
                {voucher.code}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {voucher.name}
              </span>
            </div>
          </Link>
        );
      },
    }),

    columnHelper.accessor("value", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giá trị" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-[#e2543a]">
          {formatValue(row.original)}
        </span>
      ),
    }),

    columnHelper.accessor("scope", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phạm vi" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {scopeLabel[row.getValue("scope") as string]}
        </span>
      ),
    }),

    columnHelper.accessor("usedCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đã dùng" />
      ),
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <span className="text-muted-foreground">
            {voucher.usedCount}
            {voucher.usageLimit ? ` / ${voucher.usageLimit}` : ""}
          </span>
        );
      },
    }),

    columnHelper.accessor("effectiveStatus", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("effectiveStatus") as string;
        const Icon = statusIcon[status];
        return (
          <Badge
            variant="outline"
            className={cn("gap-1 font-medium", statusStyle[status])}
          >
            {Icon && <Icon className="size-3" />}
            {statusLabel[status] ?? status}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("endAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hết hạn" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("endAt"))}</span>,
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
        const voucher = row.original;
        const isDraftOrPaused =
          voucher.effectiveStatus === "DRAFT" ||
          voucher.effectiveStatus === "PAUSED";
        const isActive = voucher.effectiveStatus === "ACTIVE";
        const isDraft = voucher.effectiveStatus === "DRAFT";
        const canChangeStatus = isDraftOrPaused || isActive || isDraft;

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
                <DropdownMenuItem onClick={() => handleCopyCode(voucher.code)}>
                  <Copy />
                  Copy mã voucher
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(voucher)}>
                  <PenLine />
                  Chỉnh sửa
                </DropdownMenuItem>

                {canChangeStatus && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Đổi trạng thái
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {isDraftOrPaused && (
                        <DropdownMenuItem
                          onClick={() => onChangeStatus(voucher, "ACTIVE")}
                        >
                          <PlayIcon className="size-4" />
                          Kích hoạt
                        </DropdownMenuItem>
                      )}
                      {isActive && (
                        <DropdownMenuItem
                          onClick={() => onChangeStatus(voucher, "PAUSED")}
                        >
                          <PauseIcon className="size-4" />
                          Tạm dừng
                        </DropdownMenuItem>
                      )}
                      {isDraft && (
                        <DropdownMenuItem
                          onClick={() => onChangeStatus(voucher, "DRAFT")}
                        >
                          <FileEdit className="size-4" />
                          Chuyển về bản nháp
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(voucher)}
                >
                  <Trash2 />
                  Xoá voucher
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
