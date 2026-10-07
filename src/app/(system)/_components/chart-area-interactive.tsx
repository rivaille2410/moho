"use client";

import * as React from "react";

import {
  Area,
  XAxis,
  YAxis,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  CalendarDays,
} from "lucide-react";

import {
  Card,
  CardTitle,
  CardAction,
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
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { formatVND } from "@/lib/currency";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardRange } from "@/types/dashboard";
import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";

export const description = "Biểu đồ doanh thu và số đơn hàng theo ngày";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const compactFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  notation: "compact",
});

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
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-lg font-bold tabular-nums">
          <span className="truncate">{value}</span>
          {hint && (
            <span className="text-xs font-normal text-muted-foreground">
              {hint}
            </span>
          )}
          {badge}
        </p>
      </div>
    </div>
  );
}

function TrendBadge({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <span
      className={
        up
          ? "inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
          : "inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive"
      }
    >
      <Icon className="size-3" />
      {Math.abs(value).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%
    </span>
  );
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<DashboardRange>("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const { data, isLoading, isError } = useRevenueChart({ range: timeRange });

  const rangeLabel =
    timeRange === "90d"
      ? "3 tháng gần nhất"
      : timeRange === "30d"
        ? "30 ngày gần nhất"
        : "7 ngày gần nhất";

  const hasData = !!data && data.length > 0;

  const totalRevenue = data?.reduce((sum, d) => sum + d.revenue, 0) ?? 0;
  const average = hasData ? totalRevenue / data.length : 0;

  const peakIndex = hasData
    ? data.reduce(
        (best, d, i) => (d.revenue > data[best].revenue ? i : best),
        0,
      )
    : -1;
  const peak = peakIndex >= 0 ? data![peakIndex] : null;
  const hasPeak = !!peak && peak.revenue > 0;

  // Xu hướng: nửa sau kỳ so với nửa đầu kỳ
  let trend: number | null = null;
  if (hasData && data.length >= 4) {
    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid).reduce((s, d) => s + d.revenue, 0);
    const secondHalf = data.slice(mid).reduce((s, d) => s + d.revenue, 0);
    if (firstHalf > 0) trend = ((secondHalf - firstHalf) / firstHalf) * 100;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Doanh thu theo ngày</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Doanh thu cho {rangeLabel.toLowerCase()}
          </span>
          <span className="@[540px]/card:hidden">{rangeLabel}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange((value[0] as DashboardRange) ?? "90d");
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 tháng gần nhất</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 ngày gần nhất</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 ngày gần nhất</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value as DashboardRange);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Chọn khoảng thời gian"
            >
              <SelectValue placeholder="3 tháng gần nhất" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 tháng gần nhất
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 ngày gần nhất
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 ngày gần nhất
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5 px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 gap-3 @xl/card:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
          </>
        ) : isError || !data ? (
          <div className="flex h-72 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu doanh thu
          </div>
        ) : !hasData ? (
          <div className="flex h-72 w-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Receipt className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Chưa có doanh thu</p>
              <p className="text-xs text-muted-foreground">
                Chưa có dữ liệu trong khoảng thời gian này
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 @xl/card:grid-cols-3">
              <StatItem
                icon={Wallet}
                label="Tổng doanh thu"
                value={formatVND(totalRevenue)}
                badge={trend !== null ? <TrendBadge value={trend} /> : null}
              />
              <StatItem
                icon={Receipt}
                label="Trung bình mỗi ngày"
                value={compactFormatter.format(average)}
              />
              <StatItem
                icon={CalendarDays}
                label="Ngày cao nhất"
                value={hasPeak ? compactFormatter.format(peak!.revenue) : "—"}
                hint={hasPeak ? formatDate(peak!.date) : undefined}
              />
            </div>

            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-72 w-full"
            >
              <AreaChart data={data} margin={{ top: 16, right: 8, left: 8 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={isMobile ? 24 : 32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (isMobile) {
                      return date.toLocaleDateString("vi-VN", {
                        day: "numeric",
                      });
                    }
                    return formatDate(value);
                  }}
                />
                <YAxis hide domain={[0, "auto"]} />

                <ChartTooltip
                  cursor={{
                    stroke: "var(--muted-foreground)",
                    strokeDasharray: "4 4",
                    strokeOpacity: 0.5,
                  }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatDate(value)}
                      formatter={(value) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="size-2 rounded-full bg-primary" />
                            Doanh thu
                          </span>
                          <span className="font-semibold tabular-nums">
                            {formatVND(Number(value))}
                          </span>
                        </div>
                      )}
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
                      value: `TB ${compactFormatter.format(average)}`,
                      position: "insideTopLeft",
                      className: "fill-muted-foreground text-[10px]",
                    }}
                  />
                )}

                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2.5}
                  activeDot={{
                    r: 5,
                    strokeWidth: 3,
                    stroke: "var(--card)",
                    fill: "var(--color-revenue)",
                  }}
                  animationDuration={900}
                  animationEasing="ease-out"
                />

                {hasPeak && (
                  <ReferenceDot
                    x={peak!.date}
                    y={peak!.revenue}
                    r={5}
                    fill="var(--color-revenue)"
                    stroke="var(--card)"
                    strokeWidth={3}
                    ifOverflow="visible"
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
