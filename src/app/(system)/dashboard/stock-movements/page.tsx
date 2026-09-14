"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { type StockMovementType } from "@/types/stock-movement";
import { useStockMovements } from "@/features/stock-movements/hooks/use-stock-movements";

import { getColumns } from "@/features/stock-movements/components/columns";
import { StockMovementsTableToolbar } from "@/features/stock-movements/components/stock-movements-table-toolbar";
import { CreateStockAdjustmentDialog } from "@/features/stock-movements/components/create-stock-adjustment-dialog";

const DashboardStockMovements = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [type, setType] = React.useState<StockMovementType | undefined>(
    undefined,
  );
  const [search, setSearch] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const { data, isLoading } = useStockMovements({ page, limit, type, search });

  const columns = React.useMemo(() => getColumns(), []);

  const handleTypeChange = (value: StockMovementType | undefined) => {
    setType(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleReset = () => {
    setType(undefined);
    setSearch("");
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
                <StockMovementsTableToolbar
                  table={table}
                  type={type}
                  onTypeChange={handleTypeChange}
                  search={search}
                  onSearchChange={handleSearchChange}
                  onReset={handleReset}
                  onCreate={() => setCreateOpen(true)}
                />
              )}
            />

            <CreateStockAdjustmentDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStockMovements;
