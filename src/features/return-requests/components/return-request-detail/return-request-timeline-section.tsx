import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ReturnRequest } from "@/types/return-request";

interface Props {
  returnRequest: ReturnRequest;
}

function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReturnRequestTimelineSection({ returnRequest }: Props) {
  const steps = [
    { label: "Yêu cầu được tạo", at: returnRequest.createdAt },
    { label: "Đã duyệt", at: returnRequest.approvedAt },
    { label: "Đã nhận hàng", at: returnRequest.itemReceivedAt },
    { label: "Đã hoàn tiền", at: returnRequest.refundedAt },
    { label: "Hoàn tất", at: returnRequest.completedAt },
  ].filter((step) => step.at);

  if (returnRequest.cancelledAt) {
    steps.push({ label: "Đã huỷ", at: returnRequest.cancelledAt });
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-semibold">Lịch sử xử lý</h2>
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start gap-2.5">
            <CheckCircle2
              className={cn(
                "mt-0.5 size-4 shrink-0",
                i === steps.length - 1
                  ? "text-secondary"
                  : "text-muted-foreground",
              )}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{step.label}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(step.at!)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
