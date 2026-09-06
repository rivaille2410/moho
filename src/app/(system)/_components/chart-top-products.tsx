"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { useTopProducts } from "@/features/dashboard/hooks/use-top-product";

const chartConfig = {
  soldCount: {
    label: "Đã bán",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const LINE_HEIGHT = 14;

function wrapLabel(text: string, maxChars: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  return lines;
}

function ProductNameTick({
  x,
  y,
  payload,
  maxChars,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  maxChars: number;
}) {
  const lines = wrapLabel(payload?.value ?? "", maxChars);
  const offsetY = -((lines.length - 1) * LINE_HEIGHT) / 2;

  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      className="fill-muted-foreground text-xs"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? offsetY : LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function ChartTopProducts() {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useTopProducts({ limit: 5 });

  const yAxisWidth = isMobile ? 96 : 180;
  const maxCharsPerLine = isMobile ? 12 : 22;

  const chartData = data?.map((p) => ({
    name: p.name,
    soldCount: p.soldCount,
  }));

  const rowHeight = chartData?.length
    ? Math.max(
        ...chartData.map(
          (item) =>
            wrapLabel(item.name, maxCharsPerLine).length * LINE_HEIGHT + 24,
        ),
      )
    : 62;
  const chartHeight = chartData ? rowHeight * chartData.length : 250;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Top sản phẩm bán chạy</CardTitle>
        <CardDescription>Xếp hạng theo số lượng đã bán</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : isError || !chartData || chartData.length === 0 ? (
          <div className="flex h-62.5 w-full items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu sản phẩm bán chạy
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: `${Math.max(chartHeight, 200)}px` }}
          >
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={yAxisWidth}
                interval={0}
                tick={<ProductNameTick maxChars={maxCharsPerLine} />}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="soldCount"
                fill="var(--color-soldCount)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
