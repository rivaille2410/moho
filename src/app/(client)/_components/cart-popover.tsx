"use client";

import { useMemo } from "react";

import Link from "next/link";
import Image from "next/image";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useCartStore } from "@/store/cart";
import { useCartView } from "@/features/cart/hooks/use-cart-view";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export function CartPopover() {
  const { items, hasHydrated, isMerging, updateQuantity, removeItem } =
    useCartView();

  const isOpen = useCartStore((state) => state.isOpen);
  const open = useCartStore((state) => state.open);
  const close = useCartStore((state) => state.close);

  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const isLoading = !hasHydrated || isMerging;

  return (
    <Popover open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <PopoverTrigger
        render={
          <Button size="lg" variant="ghost" className="relative">
            <div className="relative">
              <ShoppingBag className="size-5" />
              {!isLoading && totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 size-4.5 flex items-center justify-center text-[12px] font-medium text-background bg-secondary rounded-full">
                  {totalQuantity}
                </span>
              )}
            </div>
            <p className="hidden sm:block">Giỏ hàng</p>
          </Button>
        }
      />

      <PopoverContent align="end" className="md:min-w-sm p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Spinner className="size-6 text-secondary" />
            <p className="text-sm text-muted-foreground">
              {isMerging ? "Đang đồng bộ giỏ hàng..." : "Đang tải giỏ hàng..."}
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center text-sm text-muted-foreground">
            <ShoppingBag
              className="size-10 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p>Giỏ hàng của bạn đang trống.</p>
          </div>
        ) : (
          <>
            <div className="max-h-96 divide-y overflow-y-auto">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.thumbnailUrl ? (
                      <Image
                        fill
                        sizes="56px"
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.productName}
                    </p>

                    {item.variantName ? (
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className="size-3 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: item.variantColor ?? "#e5e5e5",
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.variantName}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 border-x py-1 text-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-secondary">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="self-start text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-base font-semibold text-secondary">
                  {formatVND(totalPrice)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={close}>
                  <Button size={"lg"} variant="outline" className="w-full">
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link href="/checkout" onClick={close}>
                  <Button size={"lg"} className="w-full">
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
