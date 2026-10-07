"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { PackageX, ShoppingBag } from "lucide-react";

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
  PENDING: {
    label: "Chờ xác nhận",
    color: "color-mix(in oklab, var(--primary) 30%, transparent)",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "color-mix(in oklab, var(--primary) 45%, transparent)",
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  SHIPPED: {
    label: "Đang giao",
    color: "color-mix(in oklab, var(--primary) 80%, transparent)",
  },
  DELIVERED: { label: "Đã giao", color: "var(--primary)" },
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
    .sort((a, b) => b.count - a.count)
    .map((item) => ({
      status: item.status,
      name: STATUS_META[item.status]?.label ?? item.status,
      value: item.count,
      percentage: item.percentage,
      fill: STATUS_META[item.status]?.color ?? "var(--muted-foreground)",
    }));

  const total = chartData?.reduce((sum, d) => sum + d.value, 0) ?? 0;
  const hasData = !!chartData && chartData.length > 0;
  const cancellationRate = data?.cancellationRate ?? 0;
  const highCancel = cancellationRate >= 10;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Trạng thái đơn hàng</CardTitle>
            <CardDescription>Phân bố đơn hàng theo trạng thái</CardDescription>
          </div>

          {data && hasData && (
            <div
              className={
                highCancel
                  ? "flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2"
                  : "flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2"
              }
            >
              <div
                className={
                  highCancel
                    ? "grid size-9 place-items-center rounded-lg bg-destructive/10 text-destructive"
                    : "grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"
                }
              >
                <PackageX className="size-4" />
              </div>
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">Tỉ lệ huỷ</p>
                <p className="text-lg font-bold tabular-nums">
                  {cancellationRate}%
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6 @lg/card:flex-row">
            <Skeleton className="size-56 shrink-0 rounded-full" />
            <div className="w-full flex-1 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu trạng thái đơn hàng
          </div>
        ) : !hasData ? (
          <div className="flex h-62.5 w-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <ShoppingBag className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Chưa có đơn hàng</p>
              <p className="text-xs text-muted-foreground">
                Chưa có đơn nào trong khoảng thời gian này
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 @lg/card:flex-row">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-62.5 w-full max-w-62.5 shrink-0"
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
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={3}
                  cornerRadius={6}
                  strokeWidth={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 6}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {total.toLocaleString("vi-VN")}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 16}
                            className="fill-muted-foreground text-xs"
                          >
                            đơn hàng
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex w-full flex-1 flex-col gap-4">
              {chartData.map((item) => (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="font-semibold">{item.value}</span>
                      <span className="w-10 text-right text-xs text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.fill,
                      }}
                    />
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
