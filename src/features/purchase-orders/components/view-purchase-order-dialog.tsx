"use client";

import Link from "next/link";
import * as React from "react";

import {
  Copy,
  Check,
  Truck,
  Package,
  Calendar,
  StickyNote,
  ExternalLink,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

import { PurchaseOrderStatusBadge } from "./status-badge";
import { type PurchaseOrder } from "@/types/purchase-order";
import { usePurchaseOrder } from "@/features/purchase-orders/hooks/use-purchase-order";

interface ViewPurchaseOrderDialogProps {
  purchaseOrder: PurchaseOrder | null;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—";
  return format(new Date(value), withTime ? "HH:mm, dd/MM/yyyy" : "dd/MM/yyyy");
}

function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.add({ type: "success", description: "Đã sao chép mã đơn" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.add({
        type: "error",
        description: "Không thể sao chép",
        priority: "high",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex items-center gap-3 rounded-md px-1.5 py-0.5 -ml-1.5 hover:bg-muted transition-colors"
      title="Sao chép mã đơn"
    >
      <span className="text-lg font-semibold">{value}</span>
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

function InfoCardSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <Skeleton className="size-4 mt-0.5 rounded shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <tr className="border-t">
      <td className="p-2.5">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      </td>
      <td className="p-2.5">
        <Skeleton className="h-4 w-8 ml-auto" />
      </td>
      <td className="p-2.5">
        <Skeleton className="h-4 w-8 ml-auto" />
      </td>
      <td className="p-2.5">
        <Skeleton className="h-5 w-20 ml-auto rounded-md" />
      </td>
      <td className="p-2.5">
        <Skeleton className="h-4 w-24 ml-auto" />
      </td>
    </tr>
  );
}

function ViewPurchaseOrderSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Package className="size-3.5" />
                  Sản phẩm
                </span>
              </th>
              <th className="text-right p-2.5 font-medium">SL đặt</th>
              <th className="text-right p-2.5 font-medium">SL nhận</th>
              <th className="text-right p-2.5 font-medium">Đơn giá</th>
              <th className="text-right p-2.5 font-medium">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <ItemRowSkeleton />
            <ItemRowSkeleton />
            <ItemRowSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ViewPurchaseOrderDialog({
  purchaseOrder,
  onOpenChange,
}: ViewPurchaseOrderDialogProps) {
  const { data: po, isLoading } = usePurchaseOrder(purchaseOrder?.id ?? "");

  const totalAmount = po?.items.reduce(
    (sum, item) => sum + Number(item.unitCost) * item.quantityOrdered,
    0,
  );

  return (
    <Dialog open={!!purchaseOrder} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>
              {isLoading || !po ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div>
                  <CopyableCode value={po.code} />
                </div>
              )}
            </DialogTitle>
            {isLoading || !po ? (
              <Skeleton className="h-5 w-20 rounded-full" />
            ) : (
              <PurchaseOrderStatusBadge status={po.status} />
            )}
          </div>
          <DialogDescription>Chi tiết đơn nhập hàng</DialogDescription>
        </DialogHeader>

        {isLoading || !po ? (
          <ViewPurchaseOrderSkeleton />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/dashboard/suppliers/${po.supplier.id}`}
                className="group flex items-start gap-3 rounded-lg border p-3 hover:border-secondary hover:ring-[3px] hover:ring-secondary/30 transition"
              >
                <Truck className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Nhà cung cấp</p>
                  <p className="text-sm font-medium group-hover:text-secondary truncate flex items-center gap-2 transition">
                    {po.supplier.name}
                    <ExternalLink className="size-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                  </p>
                </div>
              </Link>

              <Link
                href={`/dashboard/warehouses/${po.warehouse.id}`}
                className="group flex items-start gap-3 rounded-lg border p-3 hover:border-secondary hover:ring-[3px] hover:ring-secondary/30 hover:bg-muted/30 transition"
              >
                <WarehouseIcon className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Kho hàng</p>
                  <p className="text-sm font-medium group-hover:text-secondary truncate flex items-center gap-2 transition">
                    {po.warehouse.name}
                    <ExternalLink className="size-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                  </p>
                </div>
              </Link>

              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày dự kiến</p>
                  <p className="text-sm font-medium">
                    {formatDate(po.expectedAt)}
                  </p>
                </div>
              </div>

              {po.receivedAt ? (
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày nhận</p>
                    <p className="text-sm font-medium">
                      {formatDate(po.receivedAt, true)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-dashed p-3">
                  <Calendar className="size-4 mt-0.5 text-muted-foreground/50 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày nhận</p>
                    <p className="text-sm text-muted-foreground">
                      Chưa nhận hàng
                    </p>
                  </div>
                </div>
              )}

              {po.note && (
                <div className="col-span-2 flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                  <StickyNote className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ghi chú</p>
                    <p className="text-sm">{po.note}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2.5 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Package className="size-3.5" />
                        Sản phẩm
                      </span>
                    </th>
                    <th className="text-right p-2.5 font-medium">SL đặt</th>
                    <th className="text-right p-2.5 font-medium">SL nhận</th>
                    <th className="text-right p-2.5 font-medium">Đơn giá</th>
                    <th className="text-right p-2.5 font-medium">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((item) => {
                    const isFullyReceived =
                      item.quantityReceived >= item.quantityOrdered;
                    const variant = item.variant;

                    return (
                      <tr key={item.id} className="border-t">
                        <td className="p-2.5">
                          {variant ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {variant.product.name}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                {variant.colorHex && (
                                  <span
                                    className="inline-block size-2.5 rounded-full border"
                                    style={{
                                      backgroundColor: variant.colorHex,
                                    }}
                                  />
                                )}
                                {variant.colorName ?? variant.name}
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.variantId}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {item.quantityOrdered}
                        </td>
                        <td className="p-2.5 text-right">
                          <span
                            className={
                              isFullyReceived
                                ? "text-emerald-600 font-medium"
                                : item.quantityReceived > 0
                                  ? "text-amber-600 font-medium"
                                  : "text-muted-foreground"
                            }
                          >
                            {item.quantityReceived}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <span className="inline-block rounded-md bg-secondary/10 px-2 py-0.5 font-semibold text-secondary">
                            {formatCurrency(item.unitCost)}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-medium">
                          {formatCurrency(
                            Number(item.unitCost) * item.quantityOrdered,
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/30">
                    <td colSpan={4} className="p-2.5 text-right font-medium">
                      Tổng cộng
                    </td>
                    <td className="p-2.5 text-right font-bold text-base text-secondary">
                      {formatCurrency(totalAmount ?? 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
