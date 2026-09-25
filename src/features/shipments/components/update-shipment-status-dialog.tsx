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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";

import { type Shipment, type ShipmentStatus } from "@/types/shipment";
import { getTransitionLabel } from "../utils/shipment-status";
import { useUpdateShipmentStatus } from "../hooks/use-update-shipment-status";

export interface ShipmentStatusTarget {
  shipment: Shipment;
  status: ShipmentStatus;
}

interface UpdateShipmentStatusDialogProps {
  target: ShipmentStatusTarget | null;
  onOpenChange: (open: boolean) => void;
}

const DESCRIPTIONS: Partial<Record<ShipmentStatus, string>> = {
  IN_TRANSIT:
    "Vận đơn sẽ chuyển sang đang giao. Đơn hàng cũng chuyển sang Đang giao.",
  DELIVERED:
    "Xác nhận giao thành công. Khi mọi sản phẩm của đơn đã giao xong, đơn hàng sẽ tự chuyển sang Đã giao.",
  FAILED:
    "Ghi nhận giao thất bại. Vận đơn vẫn giữ số lượng, bạn có thể giao lại hoặc huỷ.",
  CANCELLED:
    "Huỷ vận đơn để nhả số lượng, sau đó có thể tạo vận đơn mới cho các sản phẩm này.",
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

export function UpdateShipmentStatusDialog({
  target,
  onOpenChange,
}: UpdateShipmentStatusDialogProps) {
  const [failedReason, setFailedReason] = React.useState("");
  const [deliveredAt, setDeliveredAt] = React.useState("");
  const [collectedAmount, setCollectedAmount] = React.useState("");

  const updateStatus = useUpdateShipmentStatus();

  React.useEffect(() => {
    if (target) {
      setFailedReason("");
      setDeliveredAt("");
      setCollectedAmount("");
    }
  }, [target]);

  if (!target) {
    return <Dialog open={false} onOpenChange={onOpenChange} />;
  }

  const { shipment, status } = target;
  const isFailed = status === "FAILED";
  const isDelivered = status === "DELIVERED";
  const title = getTransitionLabel(shipment.status, status);

  const handleSubmit = () => {
    updateStatus.mutate(
      {
        id: shipment.id,
        input: {
          status,
          failedReason: isFailed ? failedReason.trim() : undefined,
          deliveredAt:
            isDelivered && deliveredAt
              ? new Date(deliveredAt).toISOString()
              : undefined,
          collectedAmount:
            isDelivered && collectedAmount !== ""
              ? Number(collectedAmount)
              : undefined,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Vận đơn {shipment.code}. {DESCRIPTIONS[status]}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isFailed && (
            <div className="flex flex-col gap-2">
              <Label>Lý do giao thất bại</Label>
              <Textarea
                value={failedReason}
                onChange={(e) => setFailedReason(e.target.value)}
                maxLength={500}
                placeholder="Ví dụ: Khách vắng nhà, hẹn giao lại..."
              />
            </div>
          )}

          {isDelivered && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Thời gian giao thực tế</Label>
                <DateTimePicker
                  value={deliveredAt}
                  onChange={setDeliveredAt}
                  placeholder="Mặc định: bây giờ"
                  disabled={(date) => date > endOfToday()}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Số tiền COD đã thu (nếu có)</Label>
                <Input
                  type="number"
                  min={0}
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(e.target.value)}
                  placeholder="Ví dụ: 12500000"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            variant={status === "CANCELLED" ? "destructive" : "default"}
            onClick={handleSubmit}
            disabled={
              updateStatus.isPending || (isFailed && !failedReason.trim())
            }
          >
            {updateStatus.isPending && <Spinner className="size-4" />}
            {updateStatus.isPending ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
