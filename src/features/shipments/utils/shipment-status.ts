import { PackageX, XCircle, Send, PackageCheck } from "lucide-react";

import { type ShipmentStatus } from "@/types/shipment";

export const SHIPMENT_STATUS_TRANSITIONS: Record<
  ShipmentStatus,
  ShipmentStatus[]
> = {
  PREPARING: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "FAILED"],
  FAILED: ["IN_TRANSIT", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const ACTION_LABEL: Record<ShipmentStatus, string> = {
  PREPARING: "Chuẩn bị lại",
  IN_TRANSIT: "Bắt đầu giao",
  DELIVERED: "Đã giao thành công",
  FAILED: "Giao thất bại",
  CANCELLED: "Huỷ vận đơn",
};

export function getTransitionLabel(from: ShipmentStatus, to: ShipmentStatus) {
  if (from === "FAILED" && to === "IN_TRANSIT") return "Giao lại";
  return ACTION_LABEL[to];
}

export const SHIPMENT_STATUS_LABEL: Record<ShipmentStatus, string> = {
  PREPARING: "Đang chuẩn bị",
  IN_TRANSIT: "Đang giao",
  DELIVERED: "Đã giao",
  FAILED: "Giao thất bại",
  CANCELLED: "Đã huỷ",
};

export const SHIPMENT_STATUS_ICON: Record<ShipmentStatus, React.ElementType> = {
  PREPARING: PackageCheck,
  IN_TRANSIT: Send,
  DELIVERED: PackageCheck,
  FAILED: PackageX,
  CANCELLED: XCircle,
};

export const SHIPMENT_STATUS_STYLE: Record<ShipmentStatus, string> = {
  PREPARING: "border-muted-foreground/20 bg-muted text-muted-foreground",
  IN_TRANSIT: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  DELIVERED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  FAILED: "border-destructive/20 bg-destructive/10 text-destructive",
  CANCELLED: "border-muted-foreground/20 bg-muted text-muted-foreground",
};
