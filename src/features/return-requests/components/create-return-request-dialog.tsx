"use client";

import { useEffect, useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";

import { type Order } from "@/types/order";
import { ReturnReason } from "@/types/return-request";
import { useCreateReturnRequest } from "@/features/return-requests/hooks/use-create-return-request";

interface CreateReturnRequestDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

const reasonItems: { label: string; value: ReturnReason }[] = [
  { label: "Giao sai sản phẩm", value: "WRONG_ITEM" },
  { label: "Sản phẩm bị lỗi", value: "DEFECTIVE" },
  { label: "Hư hỏng khi nhận hàng", value: "DAMAGED_ON_ARRIVAL" },
  { label: "Không đúng như mô tả", value: "NOT_AS_DESCRIBED" },
  { label: "Đổi ý, không muốn mua nữa", value: "CHANGE_OF_MIND" },
  { label: "Lý do khác", value: "OTHER" },
];

export function CreateReturnRequestDialog({
  order,
  onOpenChange,
}: CreateReturnRequestDialogProps) {
  const createReturnRequest = useCreateReturnRequest();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason>("DEFECTIVE");
  const [reasonNote, setReasonNote] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedIds(new Set());
      setQuantities(
        Object.fromEntries(order.items.map((item) => [item.id, item.quantity])),
      );
      setReason("DEFECTIVE");
      setReasonNote("");
    }
  }, [order]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) createReturnRequest.reset();
  };

  const toggleItem = (itemId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!order || selectedIds.size === 0) return;

    createReturnRequest.mutate(
      {
        orderId: order.id,
        reason,
        reasonNote: reasonNote.trim() || undefined,
        items: Array.from(selectedIds).map((orderItemId) => ({
          orderItemId,
          quantity: quantities[orderItemId] ?? 1,
        })),
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!order} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] md:min-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yêu cầu trả hàng / hoàn tiền</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm cần trả trong đơn{" "}
            <span className="font-medium">{order?.orderNumber}</span> và nêu lý
            do để shop xử lý nhanh hơn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel>Sản phẩm cần trả</FieldLabel>
            {order?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="text-sm font-medium line-clamp-1">
                    {item.productName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.variantName} · Đã mua {item.quantity}
                  </span>
                </div>
                {selectedIds.has(item.id) && item.quantity > 1 && (
                  <input
                    type="number"
                    min={1}
                    max={item.quantity}
                    value={quantities[item.id] ?? 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [item.id]: Math.min(
                          item.quantity,
                          Math.max(1, Number(e.target.value)),
                        ),
                      }))
                    }
                    className="w-16 rounded-md border px-2 py-1 text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <Field>
            <FieldLabel>Lý do trả hàng</FieldLabel>
            <Select
              items={reasonItems}
              value={reason}
              onValueChange={(value: string | null) =>
                setReason((value ?? "OTHER") as ReturnReason)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent>
                {reasonItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Mô tả chi tiết (không bắt buộc)</FieldLabel>
            <Textarea
              rows={3}
              value={reasonNote}
              onChange={(e) => setReasonNote(e.target.value)}
              placeholder="Mô tả tình trạng sản phẩm, lý do cụ thể..."
            />
          </Field>

          <p className="text-xs text-muted-foreground">
            Sau khi gửi, bạn có thể đính kèm ảnh minh chứng trong mục "Trả
            hàng/Hoàn tiền".
          </p>
        </div>

        <DialogFooter>
          <Button
            size={"lg"}
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            size={"lg"}
            onClick={handleSubmit}
            disabled={selectedIds.size === 0 || createReturnRequest.isPending}
          >
            {createReturnRequest.isPending && <Spinner className="size-4" />}
            {createReturnRequest.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
