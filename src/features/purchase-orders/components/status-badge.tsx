import {
  Truck,
  XCircle,
  FileEdit,
  CircleCheck,
  PackageCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type PurchaseOrderStatus } from "@/types/purchase-order";

const statusConfig: Record<
  PurchaseOrderStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Nháp",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
    icon: FileEdit,
  },
  ORDERED: {
    label: "Đã đặt hàng",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    icon: Truck,
  },
  PARTIALLY_RECEIVED: {
    label: "Nhận một phần",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    icon: PackageCheck,
  },
  RECEIVED: {
    label: "Đã nhận hàng",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    icon: CircleCheck,
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

export function PurchaseOrderStatusBadge({
  status,
}: {
  status: PurchaseOrderStatus;
}) {
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
