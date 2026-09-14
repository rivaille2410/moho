"use client";

import * as React from "react";

import {
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/types/purchase-order";
import { DataTable } from "@/components/data-table/data-table";

import { usePurchaseOrders } from "@/features/purchase-orders/hooks/use-purchase-orders";
import { getColumns } from "@/features/purchase-orders/components/columns";
import { PurchaseOrdersTableToolbar } from "@/features/purchase-orders/components/purchase-orders-table-toolbar";
import { CreatePurchaseOrderDialog } from "@/features/purchase-orders/components/create-purchase-order-dialog";
import { ViewPurchaseOrderDialog } from "@/features/purchase-orders/components/view-purchase-order-dialog";
import { UpdatePurchaseOrderStatusDialog } from "@/features/purchase-orders/components/update-purchase-order-status-dialog";
import { ReceivePurchaseOrderDialog } from "@/features/purchase-orders/components/receive-purchase-order-dialog";

const DashboardPurchaseOrders = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [status, setStatus] = React.useState<PurchaseOrderStatus | undefined>(
    undefined,
  );

  const [createOpen, setCreateOpen] = React.useState(false);
  const [poToView, setPoToView] = React.useState<PurchaseOrder | null>(null);
  const [poToUpdateStatus, setPoToUpdateStatus] =
    React.useState<PurchaseOrder | null>(null);
  const [poToReceive, setPoToReceive] = React.useState<PurchaseOrder | null>(
    null,
  );

  const [search, setSearch] = React.useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading } = usePurchaseOrders({
    page,
    limit,
    status,
    search,
  });

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: (po) => setPoToView(po),
        onUpdateStatus: (po) => setPoToUpdateStatus(po),
        onReceive: (po) => setPoToReceive(po),
      }),
    [],
  );

  const handleStatusChange = (value: PurchaseOrderStatus | undefined) => {
    setStatus(value);
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
                <PurchaseOrdersTableToolbar
                  table={table}
                  status={status}
                  onStatusChange={handleStatusChange}
                  onCreate={() => setCreateOpen(true)}
                  search={search}
                  onSearchChange={handleSearchChange}
                />
              )}
            />

            <CreatePurchaseOrderDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
            />

            <ViewPurchaseOrderDialog
              purchaseOrder={poToView}
              onOpenChange={(open) => !open && setPoToView(null)}
            />

            <UpdatePurchaseOrderStatusDialog
              purchaseOrder={poToUpdateStatus}
              onOpenChange={(open) => !open && setPoToUpdateStatus(null)}
            />

            <ReceivePurchaseOrderDialog
              purchaseOrder={poToReceive}
              onOpenChange={(open) => !open && setPoToReceive(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPurchaseOrders;
