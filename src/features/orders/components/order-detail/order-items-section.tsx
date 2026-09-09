import Link from "next/link";
import Image from "next/image";

import { PackageOpen } from "lucide-react";

import { Order } from "@/types/order";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function OrderItemsSection({ order }: { order: Order }) {
  const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const hasMultipleLines = order.items.length > 1;

  return (
    <Card className="gap-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <PackageOpen className="size-4 text-muted-foreground" />
          Sản phẩm
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {order.items.length} loại · {totalQuantity} món
        </span>
      </CardHeader>

      <CardContent className="space-y-1">
        {order.items.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center gap-4 rounded-lg py-2 px-2 -mx-2 transition hover:bg-muted/50">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <PackageOpen className="size-6" />
                  </div>
                )}

                <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground shadow ring-2 ring-background">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/dashboard/products/${item.productId}`}
                  className="text-sm font-medium truncate hover:text-secondary block transition"
                >
                  {item.productName}
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {item.variant?.colorHex && (
                    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                      <span
                        className="size-2.5 rounded-full border"
                        style={{ backgroundColor: item.variant.colorHex }}
                      />
                      {item.variantName}
                    </span>
                  )}
                  {!item.variant?.colorHex && (
                    <span className="text-xs text-muted-foreground">
                      {item.variantName}
                    </span>
                  )}
                  {item.isReviewed && (
                    <Badge variant="secondary" className="text-[11px]">
                      Đã đánh giá
                    </Badge>
                  )}
                </div>

                {item.quantity > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(item.price)} / sản phẩm
                  </p>
                )}
              </div>

              <p className="text-base font-bold text-secondary shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>

            {index < order.items.length - 1 && <Separator className="my-1" />}
          </div>
        ))}

        {hasMultipleLines && (
          <>
            <Separator className="my-3" />

            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-muted-foreground">
                Tổng {totalQuantity} sản phẩm
              </span>
              <span className="text-lg font-bold text-secondary">
                {formatCurrency(
                  order.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
                )}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
