"use client";

import { useRef, useState } from "react";

import { ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { type ShippableOrder } from "@/types/shipment";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useShippableOrders } from "../hooks/use-shippable-orders";

interface OrderComboboxProps {
  value: ShippableOrder | undefined;
  onChange: (order: ShippableOrder) => void;
}

function OrderComboboxSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 rounded-sm px-2 py-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function OrderCombobox({ value, onChange }: OrderComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [contentWidth, setContentWidth] = useState<number>();

  const { data: orders = [], isLoading } = useShippableOrders({
    search: debouncedSearch || undefined,
    limit: 20,
  });

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setContentWidth(triggerRef.current?.offsetWidth);
        }
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger
        render={
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value
                ? `${value.orderNumber} — ${value.recipientName}`
                : "Tìm và chọn đơn hàng..."}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="p-0"
        style={contentWidth ? { width: contentWidth } : undefined}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Nhập mã đơn, tên hoặc SĐT khách hàng..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <OrderComboboxSkeleton />}

            {!isLoading && orders.length === 0 && (
              <CommandEmpty>
                {search
                  ? "Không tìm thấy đơn hàng nào."
                  : "Không có đơn hàng nào cần tạo vận đơn."}
              </CommandEmpty>
            )}

            {!isLoading && (
              <CommandGroup>
                {orders.map((order) => (
                  <CommandItem
                    key={order.id}
                    value={order.id}
                    data-checked={value?.id === order.id}
                    onSelect={() => {
                      onChange(order);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{order.orderNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.recipientName} · {order.recipientPhone} ·{" "}
                        {order.items.length} sản phẩm chưa giao
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
