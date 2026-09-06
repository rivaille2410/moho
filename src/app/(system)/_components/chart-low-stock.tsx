"use client";

import {
  Bar,
  Cell,
  XAxis,
  YAxis,
  BarChart,
  LabelList,
  CartesianGrid,
} from "recharts";
import { CheckCircle2 } from "lucide-react";

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
import { useLowStock } from "@/features/dashboard/hooks/use-low-stock";

const chartConfig = {
  stock: {
    label: "Tồn kho",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

const LINE_HEIGHT = 14;

function severityColor(stock: number, threshold: number) {
  const ratio = Math.min(Math.max(stock / threshold, 0), 1);
  const opacity = 100 - ratio * 55;
  return `color-mix(in oklab, var(--destructive) ${opacity}%, transparent)`;
}

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

export function ChartLowStock() {
  const threshold = 5;
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useLowStock({ threshold, limit: 8 });

  // Trên điện thoại, cột nhãn hẹp lại và bẻ dòng ngắn hơn để dành chỗ cho bar
  const yAxisWidth = isMobile ? 96 : 180;
  const maxCharsPerLine = isMobile ? 12 : 22;

  const chartData = data
    ?.slice()
    .sort((a, b) => a.stock - b.stock)
    .map((v) => ({
      name: `${v.productName} - ${v.variantName}`,
      stock: v.stock,
      fill: severityColor(v.stock, threshold),
    }));

  const isEmpty = !isError && chartData && chartData.length === 0;

  const rowHeight = chartData?.length
    ? Math.max(
        ...chartData.map(
          (item) =>
            wrapLabel(item.name, maxCharsPerLine).length * LINE_HEIGHT + 22,
        ),
      )
    : 36;
  const chartHeight = chartData ? rowHeight * chartData.length : 140;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tồn kho thấp</CardTitle>
        <CardDescription>
          Biến thể sắp hết hàng (≤ {threshold} sản phẩm)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-62.5 w-full" />
        ) : isError ? (
          <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu tồn kho
          </div>
        ) : isEmpty ? (
          <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center">
            <CheckCircle2
              className="size-8 text-emerald-500"
              strokeWidth={1.5}
            />
            <p className="text-sm font-medium">Kho hàng ổn định</p>
            <p className="text-xs text-muted-foreground">
              Không có biến thể nào tồn kho từ {threshold} sản phẩm trở xuống
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: `${Math.max(chartHeight, 140)}px` }}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ right: isMobile ? 20 : 28 }}
            >
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
              <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                {chartData!.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="stock"
                  position="right"
                  className="fill-foreground text-xs font-medium"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
