"use client";

import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import {
  Card,
  CardTitle,
  CardAction,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-chart";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

function ChangeBadge({ changePercent }: { changePercent: number }) {
  const isUp = changePercent >= 0;
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Badge variant="outline">
      <Icon />
      {isUp ? "+" : ""}
      {changePercent}%
    </Badge>
  );
}

function trendCopy(label: string, changePercent: number) {
  const isUp = changePercent >= 0;
  return {
    Icon: isUp ? TrendingUpIcon : TrendingDownIcon,
    headline: isUp ? `${label} tăng kỳ này` : `${label} giảm kỳ này`,
  };
}

const GRID_CLASS =
  "grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @6xl/main:grid-cols-4";

export function SectionCards() {
  const { data, isLoading, isError } = useDashboardStats({ range: "30d" });

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-32" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Không thể tải số liệu dashboard</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const revenueTrend = trendCopy("Doanh thu", data.revenue.changePercent);
  const ordersTrend = trendCopy("Đơn hàng", data.newOrders.changePercent);
  const customersTrend = trendCopy(
    "Khách hàng mới",
    data.newCustomers.changePercent,
  );

  return (
    <div
      className={`${GRID_CLASS} *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card`}
    >
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Doanh thu (30 ngày)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencyFormatter.format(data.revenue.value)}
          </CardTitle>
          <CardAction>
            <ChangeBadge changePercent={data.revenue.changePercent} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueTrend.headline}
            <revenueTrend.Icon className="size-4" />
          </div>
          <div className="text-muted-foreground">So với 30 ngày liền trước</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Đơn hàng mới</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.newOrders.value.toLocaleString("vi-VN")}
          </CardTitle>
          <CardAction>
            <ChangeBadge changePercent={data.newOrders.changePercent} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {ordersTrend.headline}
            <ordersTrend.Icon className="size-4" />
          </div>
          <div className="text-muted-foreground">So với 30 ngày liền trước</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Khách hàng mới</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.newCustomers.value.toLocaleString("vi-VN")}
          </CardTitle>
          <CardAction>
            <ChangeBadge changePercent={data.newCustomers.changePercent} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {customersTrend.headline}
            <customersTrend.Icon className="size-4" />
          </div>
          <div className="text-muted-foreground">So với 30 ngày liền trước</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Đơn đang xử lý</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.pendingOrders.value.toLocaleString("vi-VN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">Cần theo dõi và xử lý</div>
          <div className="text-muted-foreground">
            Gồm đơn chờ xác nhận, đã xác nhận và đang xử lý
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
