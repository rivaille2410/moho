import { Phone, MapPin, StickyNote, CircleAlert } from "lucide-react";

import { Order } from "@/types/order";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

export function OrderGeneralInfo({ order }: { order: Order }) {
  const initials = order.user.name
    .split(" ")
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const isDifferentRecipient = order.user.name !== order.recipientName;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Khách hàng & giao hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarImage src={order.user.avatar} alt={order.user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{order.recipientName}</p>
              {isDifferentRecipient && (
                <p className="text-xs text-muted-foreground">
                  Tài khoản: {order.user.name}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={order.recipientPhone}
            />
            <InfoRow
              icon={MapPin}
              label="Địa chỉ giao hàng"
              value={order.shippingAddress}
            />
          </div>

          {order.note && (
            <>
              <Separator />
              <InfoRow icon={StickyNote} label="Ghi chú" value={order.note} />
            </>
          )}

          {order.cancelReason && (
            <>
              <Separator />
              <div className="flex items-start gap-2.5">
                <CircleAlert className="size-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-destructive">Lý do huỷ</p>
                  <p className="text-sm font-medium text-destructive">
                    {order.cancelReason}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tổng kết đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-medium">Tổng cộng</span>
            <span className="text-lg font-bold text-secondary">
              {formatCurrency(order.total)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
