"use client";

import { Crown } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { formatVND } from "@/lib/currency";
import { type DashboardRange } from "@/types/dashboard";
import { useTopCustomers } from "@/features/dashboard/hooks/use-top-customers";

const RANK_RING = [
  "ring-amber-400/70",
  "ring-zinc-400/90",
  "ring-orange-400/60",
];

const RANK_NUMERAL = [
  "text-amber-500/40",
  "text-zinc-500/70",
  "text-orange-500/40",
];

export function TopCustomersList({
  range = "30d",
  limit = 5,
}: {
  range?: DashboardRange;
  limit?: number;
}) {
  const { data, isLoading, isError } = useTopCustomers({ range, limit });

  const maxSpent = data?.length
    ? Math.max(...data.map((c) => c.totalSpent))
    : 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Khách hàng chi tiêu nhiều nhất</CardTitle>
        <CardDescription>Xếp hạng theo tổng chi tiêu trong kỳ</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data || data.length === 0 ? (
          <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu khách hàng trong khoảng thời gian này
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((customer, index) => {
              const share =
                maxSpent > 0 ? (customer.totalSpent / maxSpent) * 100 : 0;
              const isTopThree = index < 3;

              return (
                <div
                  key={customer.userId}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-lg px-2 py-3"
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 bg-primary/5 ease-out group-hover:bg-primary/10 transition"
                    style={{ width: `${share}%` }}
                  />

                  <span
                    className={`relative w-6 shrink-0 text-center text-xl font-bold tabular-nums ${
                      RANK_NUMERAL[index] ?? "text-muted-foreground/30"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="relative shrink-0">
                    <Avatar
                      className={`size-10 border ${
                        isTopThree
                          ? `ring-2 ring-offset-2 ring-offset-card ${RANK_RING[index]}`
                          : ""
                      }`}
                    >
                      <AvatarImage
                        src={customer.avatar ?? undefined}
                        alt={customer.name}
                      />
                      <AvatarFallback>
                        {customer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <Crown
                        className="absolute -top-2 -right-1.5 size-4 rotate-12 fill-amber-400 text-amber-500"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  <div className="relative flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium leading-tight">
                      {customer.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground leading-tight">
                      {customer.orderCount} đơn hàng
                    </span>
                  </div>

                  <span className="relative shrink-0 font-semibold tabular-nums text-sm">
                    {formatVND(customer.totalSpent)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
