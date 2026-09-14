"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useVoucher } from "@/features/vouchers/hooks/use-voucher";

import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldGroup } from "@/components/ui/field";

import { VoucherDetailHeader } from "@/features/vouchers/components/voucher-detail/voucher-detail-header";
import { VoucherGeneralForm } from "@/features/vouchers/components/voucher-detail/voucher-general-form";

function VoucherDetailHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 rounded-md" />

        <Skeleton className="size-12 shrink-0 rounded-lg" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="size-6 rounded-md" />
          </div>
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <Field>
      <Skeleton className="mb-1.5 h-4 w-24" />
      <Skeleton className={className ?? "h-9 w-full"} />
    </Field>
  );
}

function VoucherGeneralFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSkeleton />
        <FieldSkeleton className="h-16 w-full" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />

          <Field>
            <Skeleton className="mb-1.5 h-4 w-24" />
            <div className="flex h-9 items-center">
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          </Field>

          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </FieldGroup>

      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}

export default function VoucherDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: voucher, isLoading, isError } = useVoucher(params.id);

  useBreadcrumbLabel(pathname, voucher?.code, isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
        <VoucherDetailHeaderSkeleton />
        <VoucherGeneralFormSkeleton />
      </div>
    );
  }

  if (isError || !voucher) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy voucher</p>
        <p className="text-sm text-muted-foreground">
          Voucher có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <VoucherDetailHeader voucher={voucher} />
      <VoucherGeneralForm voucher={voucher} />
    </div>
  );
}
