"use client";

import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useShipment } from "@/features/shipments/hooks/use-shipment";

import { ShipmentDetailHeader } from "@/features/shipments/components/shipment-detail/shipment-detail-header";
import { ShipmentInfoForm } from "@/features/shipments/components/shipment-detail/shipment-info-form";
import { ShipmentItemsCard } from "@/features/shipments/components/shipment-detail/shipment-items-card";

function ShipmentDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <Skeleton className="h-40 w-full" />

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function ShipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: shipment, isLoading, isError } = useShipment(params.id);

  useBreadcrumbLabel(pathname, shipment?.code, isLoading);

  if (isLoading) {
    return <ShipmentDetailSkeleton />;
  }

  if (isError || !shipment) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy vận đơn</p>
        <p className="text-sm text-muted-foreground">
          Vận đơn có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <ShipmentDetailHeader shipment={shipment} />
      <ShipmentItemsCard items={shipment.items} />
      <ShipmentInfoForm shipment={shipment} />
    </div>
  );
}
