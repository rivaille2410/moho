"use client";

import { useMemo } from "react";

import Link from "next/link";
import Image from "next/image";

import { X, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";

import { useCartView } from "@/features/cart/hooks/use-cart-view";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export default function CartPage() {
  const { items, hasHydrated, isMerging, updateQuantity, removeItem, clear } =
    useCartView();

  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const totalSavings = useMemo(
    () =>
      items.reduce(
        (sum, i) =>
          sum +
          (i.compareAtPrice ? (i.compareAtPrice - i.price) * i.quantity : 0),
        0,
      ),
    [items],
  );

  const isLoading = !hasHydrated || isMerging;

  if (isLoading) {
    return (
      <div className="pb-12 space-y-3">
        <PageBreadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />
        <div className="wrapper">
          <div className="flex flex-col items-center justify-center gap-2 py-44 2xl:py-80">
            <Spinner className="size-8 text-secondary" />
            {isMerging ? (
              <p className="text-sm text-muted-foreground">
                Đang đồng bộ giỏ hàng...
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pb-12 space-y-3">
        <PageBreadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
        />
        <div className="wrapper">
          <div className="flex flex-col items-center justify-center gap-4 py-44 text-center 2xl:py-80">
            <ShoppingBag
              className="size-16 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p className="text-base font-medium">
              Giỏ hàng của bạn đang trống, không có gì để thanh toán.
            </p>
            <Link href="/products">
              <Button size="xl" className="gap-2">
                <ArrowLeft className="size-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-3">
      <PageBreadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
      />

      <div className="wrapper space-y-3">
        <h1 className="text-2xl font-semibold">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          <div className="rounded-lg border lg:col-span-2">
            <div className="flex items-center justify-between border-b p-4">
              <p className="text-sm text-muted-foreground">
                {totalQuantity} sản phẩm trong giỏ
              </p>
              <button
                type="button"
                onClick={() => clear()}
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-4">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-md border bg-muted"
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        fill
                        sizes="96px"
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="line-clamp-2 text-base font-medium hover:text-secondary transition"
                      >
                        {item.productName}
                      </Link>

                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>

                      {item.variantName ? (
                        <div className="mt-1 flex items-center gap-1.5">
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

                      {item.dimensions ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Kích thước: {item.dimensions}
                        </p>
                      ) : null}

                      {item.materials ? (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          Chất liệu: {item.materials}
                        </p>
                      ) : null}

                      {item.compareAtPrice ? (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-bold text-white">
                            -
                            {Math.round(
                              (1 - item.price / item.compareAtPrice) * 100,
                            )}
                            %
                          </span>
                          <span className="text-sm font-semibold text-secondary">
                            {formatVND(item.price)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatVND(item.compareAtPrice)}
                          </span>
                        </div>
                      ) : null}
                    </div>

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
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 border-x py-1.5 text-center text-sm">
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
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <span className="text-base font-semibold text-secondary">
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
          </div>

          <div className="sticky top-20 space-y-4 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Tạm tính ({totalQuantity} sản phẩm)
                </span>
                <span className="font-medium text-secondary">
                  {formatVND(totalPrice)}
                </span>
              </div>

              {totalSavings > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tiết kiệm</span>
                  <span className="font-medium text-secondary">
                    -{formatVND(totalSavings)}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="font-medium">Miễn phí</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-xl font-bold text-secondary">
                {formatVND(totalPrice)}
              </span>
            </div>

            <div className="space-y-2">
              <Link href="/checkout" className="block">
                <Button size="xl" className="w-full">
                  Tiến hành thanh toán
                </Button>
              </Link>

              <Link href="/products" className="block">
                <Button size="xl" variant="outline" className="w-full gap-2">
                  <ArrowLeft className="size-4" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
