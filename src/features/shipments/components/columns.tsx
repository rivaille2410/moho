"use client";

import Link from "next/link";

import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Copy, Truck, MoreHorizontal } from "lucide-react";

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

import {
  getTransitionLabel,
  SHIPMENT_STATUS_ICON,
  SHIPMENT_STATUS_LABEL,
  SHIPMENT_STATUS_STYLE,
  SHIPMENT_STATUS_TRANSITIONS,
} from "../utils/shipment-status";
import { cn } from "@/lib/utils";
import { type Shipment, type ShipmentStatus } from "@/types/shipment";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, Shipment>();

interface ColumnsOptions {
  onView: (shipment: Shipment) => void;
  onChangeStatus: (shipment: Shipment, status: ShipmentStatus) => void;
}

function handleCopyCode(code: string) {
  navigator.clipboard.writeText(code);
  toast.add({ type: "success", description: "Đã sao chép mã vận đơn" });
}

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({ onView, onChangeStatus }: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.accessor("code", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã vận đơn" />
      ),
      cell: ({ row }) => {
        const shipment = row.original;
        return (
          <Link
            href={`/dashboard/shipments/${shipment.id}`}
            className="font-medium hover:text-secondary transition"
          >
            {shipment.code}
          </Link>
        );
      },
    }),

    columnHelper.accessor("orderId", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đơn hàng" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/orders/${row.original.order?.id}`}
          className="hover:text-secondary text-sm transition"
        >
          {row.original.order?.orderNumber ?? "Xem đơn hàng"}
        </Link>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as ShipmentStatus;
        const StatusIcon = SHIPMENT_STATUS_ICON[status];
        return (
          <Badge
            variant="outline"
            className={cn("font-medium gap-1", SHIPMENT_STATUS_STYLE[status])}
          >
            <StatusIcon className="size-3.5" />
            {SHIPMENT_STATUS_LABEL[status] ?? status}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("scheduledAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày dự kiến" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("scheduledAt"))}</span>,
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
        const shipment = row.original;
        const nextStatuses = SHIPMENT_STATUS_TRANSITIONS[shipment.status];

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
                <DropdownMenuItem onClick={() => handleCopyCode(shipment.code)}>
                  <Copy />
                  Copy mã vận đơn
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onView(shipment)}>
                  <Eye />
                  Xem chi tiết
                </DropdownMenuItem>

                {nextStatuses.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Truck className="size-4" />
                      Đổi trạng thái
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {nextStatuses.map((status) => {
                        const Icon = SHIPMENT_STATUS_ICON[status];
                        return (
                          <DropdownMenuItem
                            key={status}
                            variant={
                              status === "CANCELLED" || status === "FAILED"
                                ? "destructive"
                                : "default"
                            }
                            onClick={() => onChangeStatus(shipment, status)}
                          >
                            <Icon className="size-4" />
                            {getTransitionLabel(shipment.status, status)}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
