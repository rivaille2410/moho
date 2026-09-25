"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { type ReactTable } from "@tanstack/react-table";

import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { DataTable } from "@/components/data-table/data-table";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import {
  type ShipmentStatusTarget,
  UpdateShipmentStatusDialog,
} from "@/features/shipments/components/update-shipment-status-dialog";
import { getColumns } from "@/features/shipments/components/columns";
import { useShipments } from "@/features/shipments/hooks/use-shipments";
import { ShipmentsTableToolbar } from "@/features/shipments/components/shipments-table-toolbar";

const DashboardShipments = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ShipmentStatus | undefined>(
    undefined,
  );
  const [statusTarget, setStatusTarget] =
    React.useState<ShipmentStatusTarget | null>(null);

  const tableRef = React.useRef<ReactTable<DataTableFeatures, Shipment> | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useShipments({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: (shipment: Shipment) => {
          router.push(`/dashboard/shipments/${shipment.id}`);
        },
        onChangeStatus: (shipment: Shipment, newStatus: string) =>
          setStatusTarget({
            shipment,
            status: newStatus as ShipmentStatus,
          }),
      }),
    [router],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: ShipmentStatus | undefined) => {
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
              toolbar={(table) => {
                tableRef.current = table;

                return (
                  <ShipmentsTableToolbar
                    table={table}
                    search={search}
                    status={status}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>

      <UpdateShipmentStatusDialog
        target={statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
      />
    </div>
  );
};

export default DashboardShipments;
