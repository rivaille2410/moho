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

import {
  type PurchaseOrder,
  type ReceivePurchaseOrderItemInput,
} from "@/types/purchase-order";
import { usePurchaseOrder } from "@/features/purchase-orders/hooks/use-purchase-order";
import { useReceivePurchaseOrder } from "@/features/purchase-orders/hooks/use-receive-purchase-order";

interface ReceivePurchaseOrderDialogProps {
  purchaseOrder: PurchaseOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function ReceivePurchaseOrderDialog({
  purchaseOrder,
  onOpenChange,
}: ReceivePurchaseOrderDialogProps) {
  const { data: po } = usePurchaseOrder(purchaseOrder?.id ?? "");
  const receivePO = useReceivePurchaseOrder();

  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {},
  );

  React.useEffect(() => {
    if (po) {
      const initial: Record<string, number> = {};
      po.items.forEach((item) => {
        const remaining = item.quantityOrdered - item.quantityReceived;
        initial[item.id] = remaining > 0 ? remaining : 0;
      });
      setQuantities(initial);
    }
  }, [po]);

  const handleSubmit = () => {
    if (!purchaseOrder) return;

    const items: ReceivePurchaseOrderItemInput[] = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([purchaseOrderItemId, quantity]) => ({
        purchaseOrderItemId,
        quantity,
      }));

    if (items.length === 0) return;

    receivePO.mutate(
      { id: purchaseOrder.id, input: { items } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const hasAnyQuantity = Object.values(quantities).some((q) => q > 0);

  return (
    <Dialog open={!!purchaseOrder} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Nhận hàng</DialogTitle>
          <DialogDescription>
            Đơn {po?.code ?? purchaseOrder?.code} — nhập số lượng thực nhận cho
            từng sản phẩm.
          </DialogDescription>
        </DialogHeader>

        {po && (
          <div className="flex flex-col gap-2">
            {po.items.map((item) => {
              const remaining = item.quantityOrdered - item.quantityReceived;
              if (remaining <= 0) return null;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-2"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-xs">{item.variantId}</span>
                    <span className="text-xs text-muted-foreground">
                      Đã đặt {item.quantityOrdered} · Đã nhận{" "}
                      {item.quantityReceived} · Còn lại {remaining}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 w-28">
                    <Label className="text-xs">SL nhận lần này</Label>
                    <Input
                      type="number"
                      min={0}
                      max={remaining}
                      value={quantities[item.id] ?? 0}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: Math.min(
                            Number(e.target.value),
                            remaining,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={receivePO.isPending || !hasAnyQuantity}
          >
            {receivePO.isPending && <Spinner className="size-4" />}
            {receivePO.isPending ? "Đang lưu..." : "Xác nhận nhận hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
