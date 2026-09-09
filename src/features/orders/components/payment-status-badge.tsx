import { Clock, XCircle, RotateCcw, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type PaymentStatus } from "@/types/order";

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ thanh toán",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    icon: Clock,
  },
  AWAITING_CONFIRM: {
    label: "Chờ xác nhận",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã thanh toán",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Thất bại",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
    icon: RotateCcw,
  },
  PARTIALLY_REFUNDED: {
    label: "Hoàn tiền một phần",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
    icon: RotateCcw,
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-normal", config.className)}
    >
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}
