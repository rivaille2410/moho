"use client";

import { Plus, Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { type Warehouse } from "@/types/warehouse";

import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface WarehousesTableToolbarProps {
  search: string;
  onCreate: () => void;
  onSearchChange: (value: string) => void;
  onBulkDelete: (warehouses: Warehouse[]) => void;
  table: ReactTable<DataTableFeatures, Warehouse>;
}

export function WarehousesTableToolbar({
  table,
  search,
  onCreate,
  onSearchChange,
  onBulkDelete,
}: WarehousesTableToolbarProps) {
  const isFiltered = search.length > 0;

  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      onReset={() => onSearchChange("")}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên kho hàng..."
      mobileActions={
        hasSelection
          ? [
              {
                key: "bulk-delete",
                label: `Xoá (${selectedRows.length})`,
                icon: <Trash2 className="size-4" />,
                onClick: () =>
                  onBulkDelete(selectedRows.map((row) => row.original)),
                primary: true,
              },
            ]
          : [
              {
                key: "create",
                label: "Thêm kho hàng",
                icon: <Plus className="size-4" />,
                onClick: onCreate,
                primary: true,
              },
            ]
      }
      actions={
        hasSelection ? (
          <Button
            size="lg"
            variant="destructive"
            onClick={() =>
              onBulkDelete(selectedRows.map((row) => row.original))
            }
          >
            <Trash2 className="size-4" />
            <span className="hidden xl:inline">
              Xoá {selectedRows.length} kho hàng
            </span>
            <span className="xl:hidden">Xoá ({selectedRows.length})</span>
          </Button>
        ) : (
          <Button size="lg" onClick={onCreate}>
            <Plus className="size-4" />
            <span className="hidden xl:inline">Thêm kho hàng</span>
          </Button>
        )
      }
    />
  );
}
