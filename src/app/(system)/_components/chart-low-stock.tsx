"use client";

import { Bar, Cell, XAxis, YAxis, BarChart, LabelList } from "recharts";
import { CheckCircle2, TriangleAlert } from "lucide-react";

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
const BADGE_SIZE = 22;
const BADGE_GAP = 8;

type Level = "out" | "critical" | "low";

function getLevel(stock: number, threshold: number): Level {
  if (stock <= 0) return "out";
  if (stock <= Math.ceil(threshold / 2)) return "critical";
  return "low";
}

const levelFill: Record<Level, string> = {
  out: "var(--destructive)",
  critical: "color-mix(in oklab, var(--destructive) 75%, transparent)",
  low: "color-mix(in oklab, var(--destructive) 45%, transparent)",
};

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
  payload,
  maxChars,
  axisWidth,
  stocks,
  threshold,
}: {
  x?: number;
  y?: number;
  payload?: { value: string; index: number };
  maxChars: number;
  axisWidth: number;
  stocks: number[];
  threshold: number;
}) {
  const lines = wrapLabel(payload?.value ?? "", maxChars);
  const offsetY = -((lines.length - 1) * LINE_HEIGHT) / 2;
  const startX = x - axisWidth;
  const stock = stocks[payload?.index ?? 0] ?? 0;
  const level = getLevel(stock, threshold);

  return (
    <g>
      <circle
        cx={startX + BADGE_SIZE / 2}
        cy={y}
        r={BADGE_SIZE / 2}
        className={level === "low" ? "fill-destructive/15" : "fill-destructive"}
      />
      <text
        x={startX + BADGE_SIZE / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={
          level === "low"
            ? "fill-destructive text-[11px] font-bold"
            : "fill-white text-[11px] font-bold"
        }
      >
        {stock}
      </text>

      <text
        x={startX + BADGE_SIZE + BADGE_GAP}
        y={y}
        textAnchor="start"
        dominantBaseline="central"
        className={
          level === "low"
            ? "fill-muted-foreground text-xs"
            : "fill-foreground text-xs font-medium"
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

export function ChartLowStock() {
  const threshold = 5;
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useLowStock({ threshold, limit: 8 });

  const yAxisWidth = isMobile ? 130 : 220;
  const maxCharsPerLine = isMobile ? 13 : 26;

  const chartData = data
    ?.slice()
    .sort((a, b) => a.stock - b.stock)
    .map((v) => ({
      name: `${v.productName} - ${v.variantName}`,
      stock: v.stock,
      fill: levelFill[getLevel(v.stock, threshold)],
    }));

  const isEmpty = !isError && chartData && chartData.length === 0;
  const stocks = chartData?.map((d) => d.stock) ?? [];
  const criticalCount = stocks.filter(
    (s) => getLevel(s, threshold) !== "low",
  ).length;

  const rowHeight = chartData?.length
    ? Math.max(
        ...chartData.map(
          (item) =>
            wrapLabel(item.name, maxCharsPerLine).length * LINE_HEIGHT + 28,
        ),
      )
    : 40;
  const chartHeight = chartData ? rowHeight * chartData.length : 140;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Tồn kho thấp</CardTitle>
            <CardDescription>
              Biến thể sắp hết hàng (≤ {threshold} sản phẩm)
            </CardDescription>
          </div>

          {chartData && chartData.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
              <div className="grid size-9 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <TriangleAlert className="size-4" />
              </div>
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
                <p className="text-lg font-bold tabular-nums">
                  {chartData.length}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    biến thể
                  </span>
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
                  style={{ width: `${30 + i * 10}%` }}
                />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu tồn kho
          </div>
        ) : isEmpty ? (
          <div className="flex h-40 w-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
              <CheckCircle2
                className="size-7 text-emerald-500"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Kho hàng ổn định</p>
              <p className="text-xs text-muted-foreground">
                Không có biến thể nào tồn kho từ {threshold} sản phẩm trở xuống
              </p>
            </div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto w-full"
              style={{ height: `${Math.max(chartHeight, 140)}px` }}
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 0, right: 40 }}
                barCategoryGap="28%"
              >
                <XAxis type="number" hide domain={[0, threshold]} />
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
                      stocks={stocks}
                      threshold={threshold}
                    />
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="stock"
                  radius={[0, 8, 8, 0]}
                  minPointSize={6}
                  background={{
                    fill: "var(--muted)",
                    opacity: 0.5,
                    radius: 8,
                  }}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {chartData!.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="stock"
                    position="right"
                    offset={8}
                    className="fill-foreground text-xs font-semibold tabular-nums"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-xs text-muted-foreground sm:px-0">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-destructive" />
                Hết / sắp hết
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-destructive/45" />
                Thấp
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
