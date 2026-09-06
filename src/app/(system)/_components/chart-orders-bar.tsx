"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export function ChartOrdersBar({ range = "30d" }: { range?: DashboardRange }) {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useRevenueChart({ range });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Đơn hàng theo ngày</CardTitle>
        <CardDescription>Số đơn được tạo mỗi ngày</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : isError || !data ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu đơn hàng
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 48 : 32}
                tickFormatter={(value) => {
                  const date = new Date(value);
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
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Bar
                dataKey="orders"
                fill="var(--color-orders)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
