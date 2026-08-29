"use client";

import * as React from "react";

import { type Order, type OrderStatus } from "@/types/order";
import { DataTable } from "@/components/data-table/data-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { useOrders } from "@/features/orders/hooks/use-orders";
import { getColumns } from "@/features/orders/components/columns";
import { ViewOrderDialog } from "@/features/orders/components/view-order-dialog";
import { OrdersTableToolbar } from "@/features/orders/components/orders-table-toolbar";
import { UpdateOrderStatusDialog } from "@/features/orders/components/update-order-status-dialog";

const DashboardOrders = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<OrderStatus | undefined>(
    undefined,
  );

  const [orderToView, setOrderToView] = React.useState<Order | null>(null);
  const [orderToUpdate, setOrderToUpdate] = React.useState<Order | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useOrders({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: (order) => setOrderToView(order),
        onUpdateStatus: (order) => setOrderToUpdate(order),
      }),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatus(value as OrderStatus | undefined);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="@container/main flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 min-h-0">
          <div className="flex h-full min-h-0 flex-col">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              meta={
                data?.meta ?? {
                  page,
                  limit,
                  totalItems: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPreviousPage: false,
                }
              }
              isLoading={isLoading}
              onPageChange={setPage}
              onLimitChange={(value) => {
                setPage(1);
                setLimit(value);
              }}
              toolbar={(table) => (
                <OrdersTableToolbar
                  table={table}
                  search={search}
                  status={status}
                  onStatusChange={handleStatusChange}
                  onSearchChange={handleSearchChange}
                />
              )}
            />

            <ViewOrderDialog
              order={orderToView}
              onOpenChange={(open) => !open && setOrderToView(null)}
            />

            <UpdateOrderStatusDialog
              order={orderToUpdate}
              onOpenChange={(open) => !open && setOrderToUpdate(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;
