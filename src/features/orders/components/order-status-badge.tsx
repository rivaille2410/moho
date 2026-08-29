import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "Chờ xác nhận",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    },
    CONFIRMED: {
      label: "Đã xác nhận",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    },
    PROCESSING: {
      label: "Đang xử lý",
      className: "border-violet-500/20 bg-violet-500/10 text-violet-600",
    },
    SHIPPED: {
      label: "Đang giao",
      className: "border-secondary/20 bg-secondary/10 text-secondary",
    },
    DELIVERED: {
      label: "Đã giao",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    },
    CANCELLED: {
      label: "Đã huỷ",
      className: "border-destructive/20 bg-destructive/10 text-destructive",
    },
  };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-normal", config.className)}>
      {config.label}
    </Badge>
  );
}
