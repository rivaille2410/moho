"use client";

import Link from "next/link";
import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Order, OrderStatus } from "@/types/order";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";

const statusItems: { label: string; value: OrderStatus }[] = [
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

interface Props {
  order: Order;
}

export function OrderDetailHeader({ order }: Props) {
  const updateStatus = useUpdateOrderStatus();
  const [pendingCancel, setPendingCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleStatusChange = (value: string | null) => {
    if (!value) return;

    if (value === "CANCELLED") {
      setPendingCancel(true);
      return;
    }

    updateStatus.mutate({ id: order.id, status: value as OrderStatus });
  };

  const confirmCancel = () => {
    updateStatus.mutate(
      {
        id: order.id,
        status: "CANCELLED",
        cancelReason: cancelReason || undefined,
      },
      {
        onSuccess: () => {
          setPendingCancel(false);
          setCancelReason("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/orders"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách đơn hàng
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đơn hàng {order.orderNumber}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>

        <Select
          items={statusItems}
          value={order.status}
          onValueChange={handleStatusChange}
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

      <Dialog open={pendingCancel} onOpenChange={setPendingCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Huỷ đơn hàng {order.orderNumber}</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Vui lòng nhập lý do huỷ nếu có.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Lý do huỷ đơn (không bắt buộc)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingCancel(false)}>
              Đóng
            </Button>
            <Button
              variant="destructive"
              disabled={updateStatus.isPending}
              onClick={confirmCancel}
            >
              {updateStatus.isPending ? "Đang huỷ..." : "Xác nhận huỷ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
