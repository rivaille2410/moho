"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useOrder } from "@/features/orders/hooks/use-order";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { OrderGeneralInfo } from "@/features/orders/components/order-detail/order-general-info";
import { OrderDetailHeader } from "@/features/orders/components/order-detail/order-detail-header";
import { OrderItemsSection } from "@/features/orders/components/order-detail/order-items-section";
import { OrderPaymentSection } from "@/features/orders/components/order-detail/order-payment-section";

function OrderDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-1 rounded-md bg-muted p-1 w-fit">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 pt-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Skeleton className="size-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5 w-full max-w-40">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Skeleton className="size-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5 w-full max-w-72">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-4 w-full max-w-64" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: order, isLoading, isError } = useOrder(params.id);

  useBreadcrumbLabel(pathname, order?.orderNumber, isLoading);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy đơn hàng</p>
        <p className="text-sm text-muted-foreground">
          Đơn hàng có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <OrderDetailHeader order={order} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="items">
            Sản phẩm ({order.items.length})
          </TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <OrderGeneralInfo order={order} />
        </TabsContent>

        <TabsContent value="items" className="pt-4">
          <OrderItemsSection order={order} />
        </TabsContent>

        <TabsContent value="payment" className="pt-4">
          <OrderPaymentSection order={order} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
