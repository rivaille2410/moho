import {
  Ban,
  Flag,
  Clock,
  Wallet,
  XCircle,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

export const statusLabel: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  ITEM_RECEIVED: "Đã nhận hàng",
  REFUNDED: "Đã hoàn tiền",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã huỷ",
};

export const statusStyle: Record<string, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  APPROVED: "border-sky-500/20 bg-sky-500/10 text-sky-600",
  REJECTED: "border-destructive/20 bg-destructive/10 text-destructive",
  ITEM_RECEIVED: "border-violet-500/20 bg-violet-500/10 text-violet-600",
  REFUNDED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  COMPLETED: "border-emerald-600/20 bg-emerald-600/10 text-emerald-700",
  CANCELLED: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export const statusIcon: Record<string, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  ITEM_RECEIVED: PackageCheck,
  REFUNDED: Wallet,
  COMPLETED: Flag,
  CANCELLED: Ban,
};

export const reasonLabel: Record<string, string> = {
  WRONG_ITEM: "Giao sai sản phẩm",
  DEFECTIVE: "Sản phẩm lỗi",
  DAMAGED_ON_ARRIVAL: "Hư hỏng khi nhận hàng",
  NOT_AS_DESCRIBED: "Không đúng mô tả",
  CHANGE_OF_MIND: "Đổi ý",
  OTHER: "Khác",
};
