"use client";

import { useEffect, useState } from "react";

import { ImageOff, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type ShippableOrder, type ShippableOrderItem } from "@/types/shipment";

export interface SelectedShipmentItem {
  orderItemId: string;
  quantity: number;
}

interface OrderItemsListProps {
  order: ShippableOrder | undefined;
  value: SelectedShipmentItem[];
  onChange: (items: SelectedShipmentItem[]) => void;
}

const VISIBLE_ITEMS_COUNT = 2;
const COLLAPSED_HEIGHT = 140;

export function OrderItemsList({
  order,
  value,
  onChange,
}: OrderItemsListProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [order?.id]);

  if (!order) {
    return (
      <div className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
        Chọn đơn hàng để hiển thị danh sách sản phẩm
      </div>
    );
  }

  if (order.items.length === 0) {
    return (
      <div className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
        Đơn hàng này không còn sản phẩm nào cần giao
      </div>
    );
  }

  const selected = new Map(value.map((v) => [v.orderItemId, v.quantity]));

  const toggle = (item: ShippableOrderItem, checked: boolean) => {
    if (checked) {
      onChange([
        ...value,
        { orderItemId: item.orderItemId, quantity: item.remainingQuantity },
      ]);
    } else {
      onChange(value.filter((v) => v.orderItemId !== item.orderItemId));
    }
  };

  const setQuantity = (item: ShippableOrderItem, raw: number) => {
    const quantity = Math.min(
      item.remainingQuantity,
      Math.max(1, Math.floor(raw) || 1),
    );
    onChange(
      value.map((v) =>
        v.orderItemId === item.orderItemId ? { ...v, quantity } : v,
      ),
    );
  };

  const hasMore = order.items.length > VISIBLE_ITEMS_COUNT;
  const isCollapsed = hasMore && !expanded;

  return (
    <div className="relative">
      <div
        className="flex flex-col gap-2 rounded-md border overflow-y-auto transition-[max-height]"
        style={{ maxHeight: isCollapsed ? COLLAPSED_HEIGHT : 256 }}
      >
        {order.items.map((item) => {
          const quantity = selected.get(item.orderItemId);
          const isChecked = quantity !== undefined;

          return (
            <div key={item.orderItemId} className="flex items-center gap-3 p-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => toggle(item, checked === true)}
              />

              <div className="relative size-9 shrink-0 overflow-hidden rounded-md border bg-muted">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-4" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col min-w-0">
                <span className="text-sm font-medium line-clamp-1">
                  {item.productName}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {item.variantName} · Còn {item.remainingQuantity}/
                  {item.orderedQuantity}
                </span>
              </div>

              <Input
                type="number"
                min={1}
                max={item.remainingQuantity}
                disabled={!isChecked}
                value={quantity ?? item.remainingQuantity}
                onChange={(e) => setQuantity(item, Number(e.target.value))}
                className="w-20 shrink-0"
              />
            </div>
          );
        })}
      </div>

      {isCollapsed && (
        <div className="absolute inset-x-0 bottom-0 flex h-14 items-end justify-center rounded-b-md bg-linear-to-t from-background via-background/90 to-transparent pb-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setExpanded(true)}
          >
            Xem thêm {order.items.length - VISIBLE_ITEMS_COUNT} sản phẩm
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
      )}

      {hasMore && expanded && (
        <div className="flex justify-center border-t py-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setExpanded(false)}
          >
            Thu gọn
          </Button>
        </div>
      )}
    </div>
  );
}
