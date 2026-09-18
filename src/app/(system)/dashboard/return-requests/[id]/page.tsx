"use client";

import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useReturnRequest } from "@/features/return-requests/hooks/use-return-request";

import { ReturnRequestDetailHeader } from "@/features/return-requests/components/return-request-detail/return-request-detail-header";
import { ReturnRequestItemsSection } from "@/features/return-requests/components/return-request-detail/return-request-items-section";
import { ReturnRequestImagesSection } from "@/features/return-requests/components/return-request-detail/return-request-images-section";
import { ReturnRequestTimelineSection } from "@/features/return-requests/components/return-request-detail/return-request-timeline-section";
import { ReturnRequestCustomerSection } from "@/features/return-requests/components/return-request-detail/return-request-customer-section";
import { ReturnRequestRefundProofSection } from "@/features/return-requests/components/return-request-detail/return-request-refund-proof-section";

function ReturnRequestDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-56" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReturnRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const {
    data: returnRequest,
    isLoading,
    isError,
  } = useReturnRequest(params.id);

  useBreadcrumbLabel(pathname, returnRequest?.code, isLoading);

  if (isLoading) {
    return <ReturnRequestDetailSkeleton />;
  }

  if (isError || !returnRequest) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy yêu cầu trả hàng</p>
        <p className="text-sm text-muted-foreground">
          Yêu cầu có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 lg:px-6 overflow-y-auto">
      <ReturnRequestDetailHeader returnRequest={returnRequest} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ReturnRequestItemsSection returnRequest={returnRequest} />
          <ReturnRequestImagesSection returnRequest={returnRequest} />
          <ReturnRequestTimelineSection returnRequest={returnRequest} />
        </div>

        <div className="flex flex-col gap-4">
          <ReturnRequestCustomerSection returnRequest={returnRequest} />
          <ReturnRequestRefundProofSection returnRequest={returnRequest} />
        </div>
      </div>
    </div>
  );
}
