"use client";

import { useRouter } from "next/navigation";

import {
  Copy,
  PlayIcon,
  ArrowLeft,
  PauseIcon,
  TicketPercent,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/currency";
import { type Voucher } from "@/types/voucher";

import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useUpdateVoucherStatus } from "@/features/vouchers/hooks/use-update-voucher-status";

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  ACTIVE: "Đang chạy",
  PAUSED: "Tạm dừng",
  EXPIRED: "Hết hạn",
  DEPLETED: "Hết lượt",
};

const statusStyle: Record<string, string> = {
  DRAFT: "border-muted-foreground/20 bg-muted text-muted-foreground",
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  PAUSED: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  EXPIRED: "border-destructive/20 bg-destructive/10 text-destructive",
  DEPLETED: "border-destructive/20 bg-destructive/10 text-destructive",
};

function formatValue(voucher: Voucher) {
  return voucher.type === "PERCENT"
    ? `${voucher.value}%`
    : formatVND(voucher.value);
}

export function VoucherDetailHeader({ voucher }: { voucher: Voucher }) {
  const router = useRouter();
  const updateStatus = useUpdateVoucherStatus();

  const isDraftOrPaused =
    voucher.effectiveStatus === "DRAFT" || voucher.effectiveStatus === "PAUSED";
  const isActive = voucher.effectiveStatus === "ACTIVE";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    toast.add({ type: "success", description: "Đã sao chép mã voucher" });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.push("/dashboard/vouchers")}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          <TicketPercent className="size-6" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{voucher.code}</h1>
            <Button size="icon-sm" variant="ghost" onClick={handleCopyCode}>
              <Copy className="size-3.5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{voucher.name}</p>
          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                statusStyle[voucher.effectiveStatus],
              )}
            >
              {statusLabel[voucher.effectiveStatus]}
            </Badge>
            <span className="text-sm font-medium text-[#e2543a]">
              {formatValue(voucher)}
            </span>
            <span className="text-xs text-muted-foreground">
              Đã dùng {voucher.usedCount}
              {voucher.usageLimit ? ` / ${voucher.usageLimit}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDraftOrPaused && (
          <Button
            variant="outline"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate({ id: voucher.id, status: "ACTIVE" })
            }
          >
            <PlayIcon className="size-4" />
            Kích hoạt
          </Button>
        )}
        {isActive && (
          <Button
            variant="outline"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate({ id: voucher.id, status: "PAUSED" })
            }
          >
            <PauseIcon className="size-4" />
            Tạm dừng
          </Button>
        )}
      </div>
    </div>
  );
}
