"use client";

import { Bar, Cell, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Trophy } from "lucide-react";

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
const BADGE_SIZE = 20;
const BADGE_GAP = 8;

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
  x = 0,
  y = 0,
  index = 0,
  payload,
  maxChars,
  axisWidth,
}: {
  x?: number;
  y?: number;
  index?: number;
  payload?: { value: string };
  maxChars: number;
  axisWidth: number;
}) {
  const lines = wrapLabel(payload?.value ?? "", maxChars);
  const offsetY = -((lines.length - 1) * LINE_HEIGHT) / 2;
  const startX = x - axisWidth;
  const isFirst = index === 0;

  return (
    <g>
      <circle
        cx={startX + BADGE_SIZE / 2}
        cy={y}
        r={BADGE_SIZE / 2}
        className={isFirst ? "fill-primary" : "fill-muted"}
      />
      <text
        x={startX + BADGE_SIZE / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={
          isFirst
            ? "fill-primary-foreground text-[11px] font-bold"
            : "fill-muted-foreground text-[11px] font-semibold"
        }
      >
        {index + 1}
      </text>

      <text
        x={startX + BADGE_SIZE + BADGE_GAP}
        y={y}
        textAnchor="start"
        dominantBaseline="central"
        className={
          isFirst
            ? "fill-foreground text-xs font-medium"
            : "fill-muted-foreground text-xs"
        }
      >
        {lines.map((line, i) => (
          <tspan
            key={i}
            x={startX + BADGE_SIZE + BADGE_GAP}
            dy={i === 0 ? offsetY : LINE_HEIGHT}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function ChartTopProducts() {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useTopProducts({ limit: 5 });

  const yAxisWidth = isMobile ? 120 : 210;
  const maxCharsPerLine = isMobile ? 12 : 24;

  const chartData = data?.map((p) => ({
    name: p.name,
    soldCount: p.soldCount,
  }));

  const totalSold = chartData?.reduce((sum, p) => sum + p.soldCount, 0) ?? 0;

  const rowHeight = chartData?.length
    ? Math.max(
        ...chartData.map(
          (item) =>
            wrapLabel(item.name, maxCharsPerLine).length * LINE_HEIGHT + 28,
        ),
      )
    : 62;
  const chartHeight = chartData ? rowHeight * chartData.length : 250;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Top sản phẩm bán chạy</CardTitle>
            <CardDescription>Xếp hạng theo số lượng đã bán</CardDescription>
          </div>

          {chartData && chartData.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2">
              <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="size-4" />
              </div>
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">Tổng đã bán</p>
                <p className="text-lg font-bold tabular-nums">
                  {totalSold.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton
                  className="h-6 rounded-md"
                  style={{ width: `${90 - i * 14}%` }}
                />
              </div>
            ))}
          </div>
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
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 48 }}
              barCategoryGap="28%"
            >
              <defs>
                <linearGradient id="soldGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0%"
                    stopColor="var(--color-soldCount)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-soldCount)"
                    stopOpacity={1}
                  />
                </linearGradient>
              </defs>

              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={yAxisWidth}
                interval={0}
                tick={
                  <ProductNameTick
                    maxChars={maxCharsPerLine}
                    axisWidth={yAxisWidth}
                  />
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="soldCount"
                radius={[0, 8, 8, 0]}
                background={{ fill: "var(--muted)", opacity: 0.5, radius: 8 }}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill="url(#soldGradient)"
                    fillOpacity={Math.max(1 - i * 0.15, 0.4)}
                  />
                ))}
                <LabelList
                  dataKey="soldCount"
                  position="right"
                  offset={8}
                  className="fill-foreground text-xs font-semibold tabular-nums"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
