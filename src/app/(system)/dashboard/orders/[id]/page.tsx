"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useOrder } from "@/features/orders/hooks/use-order";

import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { OrderGeneralInfo } from "@/features/orders/components/order-detail/order-general-info";
import { OrderDetailHeader } from "@/features/orders/components/order-detail/order-detail-header";
import { OrderItemsSection } from "@/features/orders/components/order-detail/order-items-section";
import { OrderPaymentSection } from "@/features/orders/components/order-detail/order-payment-section";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: order, isLoading, isError } = useOrder(params.id);

  useBreadcrumbLabel(pathname, order?.orderNumber, isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8 text-secondary" />
      </div>
    );
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
