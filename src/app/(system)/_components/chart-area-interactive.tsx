"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardRange } from "@/types/dashboard";
import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";

export const description = "Biểu đồ doanh thu và số đơn hàng theo ngày";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "var(--primary)",
  },
  orders: {
    label: "Đơn hàng",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  notation: "compact",
});

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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : isError || !data ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu doanh thu
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 12 : 32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (isMobile) {
                    return date.toLocaleDateString("vi-VN", {
                      day: "numeric",
                    });
                  }
                  return date.toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return currencyFormatter.format(Number(value));
                      }
                      return String(value);
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
