"use client";

import Image from "next/image";
import { useRef } from "react";

import { ImagePlus, X } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

import { reasonLabel } from "../utils/return-request-status";
import { ReturnRequestStatusBadge } from "@/features/return-requests/components/return-request-status-badge";
import { useCancelReturnRequest } from "@/features/return-requests/hooks/use-cancel-return-request";
import { useMyReturnRequestDetail } from "@/features/return-requests/hooks/use-my-return-request-detail";
import { useAddReturnRequestImages } from "@/features/return-requests/hooks/use-add-return-request-images";

interface ViewReturnRequestDialogProps {
  returnRequestId: string | null;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(value: string) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ViewReturnRequestDialog({
  returnRequestId,
  onOpenChange,
}: ViewReturnRequestDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: item, isLoading } = useMyReturnRequestDetail(
    returnRequestId ?? undefined,
  );
  const cancelReturnRequest = useCancelReturnRequest();
  const addImages = useAddReturnRequestImages();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!returnRequestId || !e.target.files?.length) return;
    addImages.mutate({
      id: returnRequestId,
      files: Array.from(e.target.files),
    });
    e.target.value = "";
  };

  return (
    <Dialog open={!!returnRequestId} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu trả hàng</DialogTitle>
          {item && (
            <DialogDescription>
              Mã yêu cầu <span className="font-medium">{item.code}</span> · Đơn{" "}
              {item.orderNumber}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading || !item ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ReturnRequestStatusBadge status={item.status} />
              <span className="text-sm text-muted-foreground">
                {formatDate(item.createdAt)}
              </span>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Sản phẩm yêu cầu trả</span>
              {item.items.map((line) => (
                <div key={line.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {line.productName} ({line.variantName}) x{line.quantity}
                  </span>
                  <span>{formatPrice(line.unitPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 text-sm font-semibold">
                <span>Tổng hoàn dự kiến</span>
                <span className="text-secondary">
                  {formatPrice(item.refundAmount)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Lý do</span>
              <span className="text-sm text-muted-foreground">
                {reasonLabel[item.reason] ?? item.reason}
              </span>
              {item.reasonNote && (
                <span className="text-sm text-muted-foreground italic">
                  "{item.reasonNote}"
                </span>
              )}
            </div>

            {item.status === "REJECTED" && item.rejectReason && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                Lý do từ chối: {item.rejectReason}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Ảnh minh chứng</span>
              <div className="flex flex-wrap gap-2">
                {item.images.map((url) => (
                  <div
                    key={url}
                    className="relative size-16 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={url}
                      alt="Ảnh minh chứng"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}

                {item.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={addImages.isPending}
                      className="flex size-16 items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted"
                    >
                      {addImages.isPending ? (
                        <Spinner className="size-4" />
                      ) : (
                        <ImagePlus className="size-5" />
                      )}
                    </button>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {item?.status === "PENDING" && (
          <DialogFooter>
            <Button
              size={"lg"}
              variant="outline"
              disabled={cancelReturnRequest.isPending}
              onClick={() =>
                cancelReturnRequest.mutate(item.id, {
                  onSuccess: () => onOpenChange(false),
                })
              }
            >
              {cancelReturnRequest.isPending && <Spinner className="size-4" />}
              <X className="size-4" />
              Huỷ yêu cầu
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
