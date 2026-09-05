"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useVoucher } from "@/features/vouchers/hooks/use-voucher";

import { Spinner } from "@/components/ui/spinner";

import { VoucherDetailHeader } from "@/features/vouchers/components/voucher-detail/voucher-detail-header";
import { VoucherGeneralForm } from "@/features/vouchers/components/voucher-detail/voucher-general-form";

export default function VoucherDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: voucher, isLoading, isError } = useVoucher(params.id);

  useBreadcrumbLabel(pathname, voucher?.code, isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8 text-secondary" />
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
