"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  type DashboardRange,
  type OrderStatusDistributionItem,
} from "@/types/dashboard";
import { useOrderStatusDistribution } from "@/features/dashboard/hooks/use-order-status-distribution";

const STATUS_META: Record<
  OrderStatusDistributionItem["status"],
  { label: string; color: string }
> = {
  PENDING: { label: "Chờ xác nhận", color: "var(--primary)" },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "color-mix(in oklab, var(--primary) 80%, transparent)",
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  SHIPPED: {
    label: "Đang giao",
    color: "color-mix(in oklab, var(--primary) 40%, transparent)",
  },
  DELIVERED: {
    label: "Đã giao",
    color: "color-mix(in oklab, var(--primary) 25%, transparent)",
  },
  CANCELLED: { label: "Đã huỷ", color: "var(--destructive)" },
};

const chartConfig = Object.fromEntries(
  Object.entries(STATUS_META).map(([status, meta]) => [
    status,
    { label: meta.label, color: meta.color },
  ]),
) satisfies ChartConfig;

export function ChartOrderStatus({
  range = "30d",
}: {
  range?: DashboardRange;
}) {
  const { data, isLoading, isError } = useOrderStatusDistribution({ range });

  const chartData = data?.distribution
    .filter((item) => item.count > 0)
    .map((item) => ({
      status: item.status,
      name: STATUS_META[item.status]?.label ?? item.status,
      value: item.count,
      percentage: item.percentage,
      fill: STATUS_META[item.status]?.color ?? "var(--muted-foreground)",
    }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Trạng thái đơn hàng</CardTitle>
        <CardDescription>
          Phân bố đơn hàng theo trạng thái
          {data ? ` · Tỉ lệ huỷ ${data.cancellationRate}%` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : isError || !chartData || chartData.length === 0 ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Chưa có đơn hàng trong khoảng thời gian này
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 @lg/card:flex-row">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-62.5 w-full max-w-62.5"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, _name, item) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span>{item.payload.name}</span>
                          <span className="font-medium tabular-nums">
                            {value} ({item.payload.percentage}%)
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex flex-1 flex-col gap-2">
              {chartData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">
                      {item.value}
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
