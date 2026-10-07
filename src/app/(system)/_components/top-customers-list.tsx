"use client";

import { Users, Wallet } from "lucide-react";

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

export function TopCustomersList({
  range = "30d",
  limit = 5,
}: {
  range?: DashboardRange;
  limit?: number;
}) {
  const { data, isLoading, isError } = useTopCustomers({ range, limit });

  const hasData = !!data && data.length > 0;
  const totalSpent = data?.reduce((sum, c) => sum + c.totalSpent, 0) ?? 0;
  const maxSpent = hasData ? Math.max(...data.map((c) => c.totalSpent)) : 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Khách hàng chi tiêu nhiều nhất</CardTitle>
            <CardDescription>
              Xếp hạng theo tổng chi tiêu trong kỳ
            </CardDescription>
          </div>

          {hasData && (
            <div className="hidden items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2 sm:flex">
              <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="size-4" />
              </div>
              <div className="leading-tight">
                <p className="text-xs text-muted-foreground">
                  Tổng chi tiêu top {data.length}
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {formatVND(totalSpent)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5">
                <Skeleton className="size-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-1 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
            Không thể tải dữ liệu khách hàng
          </div>
        ) : !hasData ? (
          <div className="flex h-40 w-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Users className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Chưa có khách hàng</p>
              <p className="text-xs text-muted-foreground">
                Chưa có dữ liệu chi tiêu trong khoảng thời gian này
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y">
            {data.map((customer, index) => {
              const share =
                maxSpent > 0 ? (customer.totalSpent / maxSpent) * 100 : 0;
              const percent =
                totalSpent > 0
                  ? Math.round((customer.totalSpent / totalSpent) * 100)
                  : 0;
              const isFirst = index === 0;

              return (
                <li
                  key={customer.userId}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-11 border">
                      <AvatarImage
                        src={customer.avatar ?? undefined}
                        alt={customer.name}
                      />
                      <AvatarFallback>
                        {customer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-card text-[10px] font-bold tabular-nums ${
                        isFirst
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-medium">
                          {customer.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                          {customer.orderCount} đơn · {percent}%
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-semibold tabular-nums ${
                          isFirst ? "text-primary" : ""
                        }`}
                      >
                        {formatVND(customer.totalSpent)}
                      </span>
                    </div>

                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isFirst ? "bg-primary" : "bg-primary/40"
                        }`}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
