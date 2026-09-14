import {
  Undo2,
  Settings2,
  PackagePlus,
  ShoppingCart,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type StockMovementType } from "@/types/stock-movement";

const typeConfig: Record<
  StockMovementType,
  { label: string; className: string; icon: React.ElementType }
> = {
  PURCHASE_IN: {
    label: "Nhập hàng",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    icon: PackagePlus,
  },
  SALE_OUT: {
    label: "Bán hàng",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    icon: ShoppingCart,
  },
  RETURN_IN: {
    label: "Trả hàng",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    icon: Undo2,
  },
  ADJUSTMENT: {
    label: "Điều chỉnh",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
    icon: Settings2,
  },
  DAMAGED_OUT: {
    label: "Hàng hỏng",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: AlertTriangle,
  },
  TRANSFER_IN: {
    label: "Chuyển đến",
    className: "border-secondary/20 bg-secondary/10 text-secondary",
    icon: ArrowDownToLine,
  },
  TRANSFER_OUT: {
    label: "Chuyển đi",
    className: "border-secondary/20 bg-secondary/10 text-secondary",
    icon: ArrowUpFromLine,
  },
};

export function StockMovementTypeBadge({ type }: { type: StockMovementType }) {
  const config = typeConfig[type];
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
