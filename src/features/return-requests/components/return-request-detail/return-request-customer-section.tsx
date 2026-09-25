import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { type ReturnRequest } from "@/types/return-request";
import { reasonLabel } from "@/features/return-requests/utils/return-request-status";

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

interface Props {
  returnRequest: ReturnRequest;
}

export function ReturnRequestCustomerSection({ returnRequest }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Khách hàng</h2>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10">
            <AvatarImage
              src={returnRequest.customerAvatar ?? undefined}
              alt={returnRequest.customerName}
            />
            <AvatarFallback>
              {returnRequest.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">
              {returnRequest.customerName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {returnRequest.customerEmail}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Thông tin yêu cầu</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Lý do</dt>
            <dd>{reasonLabel[returnRequest.reason] ?? returnRequest.reason}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Số tiền hoàn</dt>
            <dd className="text-lg font-semibold text-secondary">
              {formatPrice(returnRequest.refundAmount)}
            </dd>
          </div>
          {returnRequest.refundMethod && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phương thức hoàn</dt>
              <dd>
                {returnRequest.refundMethod === "BANK_TRANSFER"
                  ? "Chuyển khoản"
                  : "Phương thức gốc"}
              </dd>
            </div>
          )}
          {returnRequest.refundBankAccountNumber && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Số tài khoản</dt>
              <dd>{returnRequest.refundBankAccountNumber}</dd>
            </div>
          )}
          {returnRequest.refundBankAccountHolder && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Chủ tài khoản</dt>
              <dd>{returnRequest.refundBankAccountHolder}</dd>
            </div>
          )}
        </dl>

        {returnRequest.reasonNote && (
          <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            {returnRequest.reasonNote}
          </div>
        )}
      </div>

      {(returnRequest.adminNote || returnRequest.rejectReason) && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-sm font-semibold">Ghi chú admin</h2>
          {returnRequest.adminNote && (
            <p className="text-sm text-muted-foreground">
              {returnRequest.adminNote}
            </p>
          )}
          {returnRequest.rejectReason && (
            <p className="text-sm text-destructive">
              Lý do từ chối: {returnRequest.rejectReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
