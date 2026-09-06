import {
  Clock,
  Truck,
  Loader2,
  XCircle,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type OrderStatus } from "@/types/order";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    icon: Loader2,
  },
  SHIPPED: {
    label: "Đang giao",
    className: "border-secondary/20 bg-secondary/10 text-secondary",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    icon: PackageCheck,
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
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
