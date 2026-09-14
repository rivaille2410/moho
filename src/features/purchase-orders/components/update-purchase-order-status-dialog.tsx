"use client";

import * as React from "react";

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

import {
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/types/purchase-order";
import { useUpdatePurchaseOrderStatus } from "@/features/purchase-orders/hooks/use-update-purchase-order-status";

interface UpdatePurchaseOrderStatusDialogProps {
  purchaseOrder: PurchaseOrder | null;
  onOpenChange: (open: boolean) => void;
}

function getAllowedStatuses(
  current: PurchaseOrderStatus,
): PurchaseOrderStatus[] {
  if (current === "DRAFT") return ["DRAFT", "ORDERED", "CANCELLED"];
  if (current === "ORDERED") return ["ORDERED", "CANCELLED"];
  return [current];
}

const statusLabels: Record<PurchaseOrderStatus, string> = {
  DRAFT: "Nháp",
  ORDERED: "Đã đặt",
  PARTIALLY_RECEIVED: "Nhận một phần",
  RECEIVED: "Đã nhận đủ",
  CANCELLED: "Đã huỷ",
};

export function UpdatePurchaseOrderStatusDialog({
  purchaseOrder,
  onOpenChange,
}: UpdatePurchaseOrderStatusDialogProps) {
  const [status, setStatus] = React.useState<PurchaseOrderStatus>("DRAFT");

  const updateStatus = useUpdatePurchaseOrderStatus();

  React.useEffect(() => {
    if (purchaseOrder) setStatus(purchaseOrder.status);
  }, [purchaseOrder]);

  const allowed = purchaseOrder ? getAllowedStatuses(purchaseOrder.status) : [];

  const handleSubmit = () => {
    if (!purchaseOrder) return;

    updateStatus.mutate(
      { id: purchaseOrder.id, input: { status } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!purchaseOrder} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn nhập hàng</DialogTitle>
          <DialogDescription>Đơn {purchaseOrder?.code}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label>Trạng thái</Label>
          <Select
            items={allowed.map((s) => ({ label: statusLabels[s], value: s }))}
            value={status}
            onValueChange={(value) => setStatus(value as PurchaseOrderStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {allowed.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              updateStatus.isPending || status === purchaseOrder?.status
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
