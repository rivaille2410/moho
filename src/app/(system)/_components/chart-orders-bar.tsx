"use client";

import {
  Bar,
  Cell,
  XAxis,
  YAxis,
  BarChart,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { ShoppingBag, TrendingUp, CalendarDays } from "lucide-react";

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

import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardRange } from "@/types/dashboard";
import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";

const chartConfig = {
  orders: {
    label: "Đơn hàng",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
  });

function StatItem({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold tabular-nums">
          {value}
          {hint && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {hint}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export function ChartOrdersBar({ range = "30d" }: { range?: DashboardRange }) {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useRevenueChart({ range });

  const hasData = !!data && data.length > 0;

  const totalOrders = data?.reduce((sum, d) => sum + d.orders, 0) ?? 0;
  const average = hasData ? totalOrders / data.length : 0;

  const peakIndex = hasData
    ? data.reduce((best, d, i) => (d.orders > data[best].orders ? i : best), 0)
    : -1;
  const peak = peakIndex >= 0 ? data![peakIndex] : null;
  const hasPeak = !!peak && peak.orders > 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Đơn hàng theo ngày</CardTitle>
        <CardDescription>Số đơn được tạo mỗi ngày</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 gap-3 @md/card:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <div className="flex h-62.5 items-end gap-2 px-2">
              {[45, 70, 35, 85, 60, 50, 95, 40, 75, 55, 65, 30].map((h, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </>
        ) : isError || !data ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu đơn hàng
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
          <>
            <div className="grid grid-cols-1 gap-3 @md/card:grid-cols-3">
              <StatItem
                icon={ShoppingBag}
                label="Tổng đơn hàng"
                value={totalOrders.toLocaleString("vi-VN")}
              />
              <StatItem
                icon={TrendingUp}
                label="Trung bình mỗi ngày"
                value={average.toLocaleString("vi-VN", {
                  maximumFractionDigits: 1,
                })}
                hint="đơn"
              />
              <StatItem
                icon={CalendarDays}
                label="Ngày cao nhất"
                value={hasPeak ? formatDate(peak!.date) : "—"}
                hint={hasPeak ? `${peak!.orders} đơn` : undefined}
              />
            </div>

            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <BarChart data={data} margin={{ top: 12, right: 8 }}>
                <defs>
                  <linearGradient
                    id="ordersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.95}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.25}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={isMobile ? 48 : 32}
                  tickFormatter={formatDate}
                />
                <YAxis hide domain={[0, "auto"]} />

                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.5, radius: 6 }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatDate(value)}
                      indicator="dot"
                    />
                  }
                />

                {average > 0 && (
                  <ReferenceLine
                    y={average}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.6}
                    label={{
                      value: `TB ${average.toLocaleString("vi-VN", {
                        maximumFractionDigits: 1,
                      })}`,
                      position: "insideTopRight",
                      className: "fill-muted-foreground text-[10px]",
                    }}
                  />
                )}

                <Bar
                  dataKey="orders"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        hasPeak && i === peakIndex
                          ? "var(--color-orders)"
                          : "url(#ordersGradient)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
