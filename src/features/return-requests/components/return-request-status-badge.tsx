import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReturnStatus } from "@/types/return-request";

const statusLabel: Record<ReturnStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt, chờ gửi hàng",
  REJECTED: "Đã bị từ chối",
  ITEM_RECEIVED: "Đã nhận hàng",
  REFUNDED: "Đã hoàn tiền",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã huỷ",
};

const statusStyle: Record<ReturnStatus, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  APPROVED: "border-sky-500/20 bg-sky-500/10 text-sky-600",
  REJECTED: "border-destructive/20 bg-destructive/10 text-destructive",
  ITEM_RECEIVED: "border-violet-500/20 bg-violet-500/10 text-violet-600",
  REFUNDED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  COMPLETED: "border-emerald-600/20 bg-emerald-600/10 text-emerald-700",
  CANCELLED: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export function ReturnRequestStatusBadge({ status }: { status: ReturnStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyle[status])}>
      {statusLabel[status]}
    </Badge>
  );
}
