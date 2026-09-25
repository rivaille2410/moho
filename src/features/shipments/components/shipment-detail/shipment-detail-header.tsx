import Link from "next/link";

import { ArrowLeft, Phone, Truck, MapPin, CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SHIPMENT_STATUS_ICON,
  SHIPMENT_STATUS_LABEL,
  SHIPMENT_STATUS_STYLE,
} from "../../utils/shipment-status";
import { Badge } from "@/components/ui/badge";
import { type Shipment } from "@/types/shipment";

interface Props {
  shipment: Shipment;
}

export function ShipmentDetailHeader({ shipment }: Props) {
  const StatusIcon = SHIPMENT_STATUS_ICON[shipment.status];

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/shipments"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách vận đơn
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {shipment.code}
          </h1>
          <Badge
            variant="outline"
            className={cn(
              "font-medium gap-1",
              SHIPMENT_STATUS_STYLE[shipment.status],
            )}
          >
            <StatusIcon className="size-3.5" />
            {SHIPMENT_STATUS_LABEL[shipment.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link
            href={`/dashboard/orders/${shipment.order.id}`}
            className="flex items-center gap-1 hover:text-secondary transition"
          >
            <Truck className="size-3.5" />
            Đơn {shipment.order.orderNumber}
          </Link>
          <span className="flex items-center gap-1">
            <Phone className="size-3.5" />
            {shipment.order.recipientPhone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {shipment.order.shippingAddress}
          </span>
          {shipment.scheduledAt && (
            <span className="flex items-center gap-1">
              <CalendarClock className="size-3.5" />
              Hẹn giao:{" "}
              {new Date(shipment.scheduledAt).toLocaleDateString("vi-VN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
