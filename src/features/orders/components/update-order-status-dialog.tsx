"use client";

import * as React from "react";

import Link from "next/link";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { type Order, type OrderStatus } from "@/types/order";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";

interface UpdateOrderStatusDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

const statusItems: { label: string; value: OrderStatus }[] = [
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

const MANUAL_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: [],
  SHIPPED: [],
  DELIVERED: [],
  CANCELLED: [],
};

export function UpdateOrderStatusDialog({
  order,
  onOpenChange,
}: UpdateOrderStatusDialogProps) {
  const [status, setStatus] = React.useState<OrderStatus>(
    order?.status ?? "PENDING",
  );
  const [cancelReason, setCancelReason] = React.useState("");

  const updateStatus = useUpdateOrderStatus();

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCancelReason("");
    }
  }, [order]);

  const nextStatuses = order ? MANUAL_TRANSITIONS[order.status] : [];
  const selectableItems = statusItems.filter(
    (item) => item.value === order?.status || nextStatuses.includes(item.value),
  );
  const drivenByShipments =
    !!order && nextStatuses.length === 0 && order.status !== "CANCELLED";

  const handleSubmit = () => {
    if (!order) return;

    updateStatus.mutate(
      {
        id: order.id,
        status,
        cancelReason: status === "CANCELLED" ? cancelReason : undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>Đơn hàng {order?.orderNumber}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {drivenByShipments ? (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              Trạng thái giao hàng của đơn được cập nhật thông qua vận đơn. Hãy
              tạo hoặc cập nhật vận đơn tại{" "}
              <Link
                href="/dashboard/shipments"
                className="text-secondary hover:underline"
              >
                trang Vận đơn
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Trạng thái</Label>
              <Select
                items={statusItems}
                value={status}
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {selectableItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {status === "CANCELLED" && (
            <div className="flex flex-col gap-2">
              <Label>Lý do huỷ</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do huỷ đơn..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              updateStatus.isPending ||
              drivenByShipments ||
              status === order?.status ||
              (status === "CANCELLED" && !cancelReason.trim())
            }
          >
            {updateStatus.isPending && <Spinner className="size-4" />}
            {updateStatus.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
