"use client";

import Image from "next/image";
import { MapPin, StickyNote, Ban } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { type Order } from "@/types/order";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

interface ViewOrderDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ViewOrderDialog({ order, onOpenChange }: ViewOrderDialogProps) {
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-xl">
        <DialogHeader>
          <DialogTitle>Đơn hàng {order?.orderNumber}</DialogTitle>
          <DialogDescription>
            Đặt lúc {order && formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  {order.user.avatar && (
                    <AvatarImage
                      src={order.user.avatar}
                      alt={order.recipientName}
                    />
                  )}
                  <AvatarFallback>
                    {order.recipientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{order.recipientName}</span>
                  <span className="text-sm text-muted-foreground">
                    {order.recipientPhone}
                  </span>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Địa chỉ giao hàng
                  </span>
                  <span className="text-sm">{order.shippingAddress}</span>
                </div>
              </div>

              {order.note && (
                <div className="flex items-start gap-2.5">
                  <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Ghi chú
                    </span>
                    <span className="text-sm">{order.note}</span>
                  </div>
                </div>
              )}

              {order.status === "CANCELLED" && order.cancelReason && (
                <div className="flex items-start gap-2.5">
                  <Ban className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-destructive">
                      Lý do huỷ
                    </span>
                    <span className="text-sm text-destructive">
                      {order.cancelReason}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.thumbnailUrl && (
                      <Image
                        fill
                        src={item.thumbnailUrl}
                        sizes="48px"
                        className="object-cover"
                        alt={item.productName}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.productName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.variantName} · x{item.quantity}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-secondary">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-medium">
                <span>Tổng cộng</span>
                <span className="text-lg font-semibold text-secondary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
