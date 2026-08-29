"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";

import { PackageOpen, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { type Order, type OrderStatus } from "@/types/order";
import { useMyOrders } from "@/features/orders/hooks/use-my-orders";
import { useProductSlugs } from "@/features/products/hooks/use-product-slugs";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

import { ViewOrderDialog } from "@/features/orders/components/view-order-dialog";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { WriteReviewDialog } from "@/features/reviews/components/write-review-dialog";

type StatusFilter = "ALL" | OrderStatus;

type ReviewTarget = {
  slug: string;
  productName: string;
  variantId?: string;
};

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

function formatCurrency(value: string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [page, setPage] = React.useState(1);
  const [orderToView, setOrderToView] = React.useState<Order | null>(null);
  const [reviewTarget, setReviewTarget] = React.useState<ReviewTarget | null>(
    null,
  );

  const { data, isLoading } = useMyOrders({
    page,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const productIds = React.useMemo(
    () =>
      data?.data.flatMap((order) =>
        order.items.map((item) => item.productId),
      ) ?? [],
    [data],
  );

  const { data: productSlugs } = useProductSlugs(productIds);

  const handleFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <section className="w-full space-y-3 pb-12">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Đơn hàng của tôi" },
        ]}
      />

      <div className="wrapper space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Đơn hàng của tôi</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi trạng thái và lịch sử các đơn hàng bạn đã đặt
          </p>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 text-sm transition",
                statusFilter === tab.value
                  ? "border-secondary font-medium text-secondary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <PackageOpen
              className="size-16 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p className="text-sm text-muted-foreground">
              Bạn chưa có đơn hàng nào{" "}
              {statusFilter !== "ALL" && "ở trạng thái này"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.data.map((order) => (
              <div
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={() => setOrderToView(order)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOrderToView(order);
                  }
                }}
                className="flex cursor-pointer flex-col gap-3 rounded-lg border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.orderNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      · {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  {order.items.slice(0, 2).map((item) => {
                    const slug = productSlugs?.[item.productId];
                    const isDelivered = order.status === "DELIVERED";
                    const canReview = isDelivered && slug && !item.isReviewed;
                    const alreadyReviewed = isDelivered && item.isReviewed;

                    const content = (
                      <>
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                          {item.thumbnailUrl && (
                            <Image
                              fill
                              src={item.thumbnailUrl}
                              sizes="48px"
                              className="object-cover"
                              alt={item.productName}
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <span
                            className={cn(
                              "line-clamp-1 text-sm font-medium transition",
                              slug && "hover:text-secondary",
                            )}
                          >
                            {item.productName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.variantName} · x{item.quantity}
                          </span>
                        </div>
                      </>
                    );

                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        {!slug ? (
                          <div className="flex flex-1 items-center gap-3">
                            {content}
                          </div>
                        ) : (
                          <Link
                            href={`/products/${slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-1 items-center gap-3 rounded-md -mx-1 px-1 py-0.5 transition hover:bg-muted/60"
                          >
                            {content}
                          </Link>
                        )}

                        {canReview && (
                          <Button
                            variant="secondary"
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewTarget({
                                slug: slug!,
                                productName: item.productName,
                                variantId: item.variantId,
                              });
                            }}
                          >
                            <Star className="size-4" />
                            Đánh giá
                          </Button>
                        )}

                        {alreadyReviewed && (
                          <Button variant="secondary" size="lg" disabled>
                            <Star className="size-4" />
                            Đã đánh giá
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {order.items.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{order.items.length - 2} sản phẩm khác
                    </span>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {order.items.length} sản phẩm
                  </span>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-muted-foreground">Tổng tiền:</span>
                    <span className="font-semibold text-secondary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.hasPreviousPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Trước
                </Button>
                <span className="text-sm text-muted-foreground">
                  Trang {data.meta.page} / {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </div>
        )}

        <ViewOrderDialog
          order={orderToView}
          onOpenChange={(open) => !open && setOrderToView(null)}
        />

        <WriteReviewDialog
          target={reviewTarget}
          onOpenChange={(open) => !open && setReviewTarget(null)}
        />
      </div>
    </section>
  );
};

export default OrdersPage;
