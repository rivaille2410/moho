"use client";

import { Wallet, Landmark, CreditCard, CalendarCheck } from "lucide-react";
import { vi } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Order } from "@/types/order";
import { PaymentStatusBadge } from "@/features/orders/components/payment-status-badge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

const METHOD_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string; accent: string }
> = {
  COD: {
    label: "Thanh toán khi nhận hàng",
    icon: Wallet,
    className: "bg-amber-500/10 text-amber-600",
    accent: "from-amber-500/10",
  },
  BANK_TRANSFER: {
    label: "Chuyển khoản ngân hàng",
    icon: Landmark,
    className: "bg-sky-500/10 text-sky-600",
    accent: "from-sky-500/10",
  },
  VNPAY: {
    label: "VNPay",
    icon: CreditCard,
    className: "bg-blue-500/10 text-blue-600",
    accent: "from-blue-500/10",
  },
  MOMO: {
    label: "MoMo",
    icon: CreditCard,
    className: "bg-pink-500/10 text-pink-600",
    accent: "from-pink-500/10",
  },
  ZALOPAY: {
    label: "ZaloPay",
    icon: CreditCard,
    className: "bg-cyan-500/10 text-cyan-600",
    accent: "from-cyan-500/10",
  },
};

export function OrderPaymentSection({ order }: { order: Order }) {
  const { payment } = order;

  const method = payment ? METHOD_CONFIG[payment.method] : undefined;
  const MethodIcon = method?.icon ?? CreditCard;

  return (
    <Card className="overflow-hidden gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Thanh toán</CardTitle>
      </CardHeader>

      <CardContent>
        {!payment ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Chưa có thông tin thanh toán.
          </p>
        ) : (
          <div
            className={cn(
              "flex flex-nowrap items-center justify-between gap-3 rounded-xl bg-linear-to-br to-transparent px-4 py-3.5",
              method?.accent ?? "from-muted",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  method?.className,
                )}
              >
                <MethodIcon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight">
                  {method?.label ?? payment.method}
                </p>
                {payment.confirmedAt ? (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground leading-tight">
                    <CalendarCheck className="size-3" />
                    Xác nhận{" "}
                    {formatDistanceToNow(new Date(payment.confirmedAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Số tiền
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <p className="whitespace-nowrap text-lg font-bold tracking-tight text-secondary">
                {formatCurrency(payment.amount)}
              </p>
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
