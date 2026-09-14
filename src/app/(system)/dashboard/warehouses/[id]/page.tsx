"use client";

import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useWarehouse } from "@/features/warehouses/hooks/use-warehouse";

import { WarehouseGeneralForm } from "@/features/warehouses/components/warehouse-detail/warehouse-general-form";
import { WarehouseDetailHeader } from "@/features/warehouses/components/warehouse-detail/warehouse-detail-header";

function WarehouseDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function WarehouseDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: warehouse, isLoading, isError } = useWarehouse(params.id);

  useBreadcrumbLabel(pathname, warehouse?.name, isLoading);

  if (isLoading) {
    return <WarehouseDetailSkeleton />;
  }

  if (isError || !warehouse) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy kho hàng</p>
        <p className="text-sm text-muted-foreground">
          Kho hàng có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <WarehouseDetailHeader warehouse={warehouse} />
      <WarehouseGeneralForm warehouse={warehouse} />
    </div>
  );
}
