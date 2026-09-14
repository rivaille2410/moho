"use client";

import { Plus, Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { type Supplier } from "@/types/supplier";

import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface SuppliersTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onBulkDelete: (suppliers: Supplier[]) => void;
  table: ReactTable<DataTableFeatures, Supplier>;
}

const supplierColumnLabels: Record<string, string> = {
  name: "Nhà cung cấp",
  contactName: "Người liên hệ",
  phone: "Số điện thoại",
  email: "Email",
  createdAt: "Ngày tạo",
};

export function SuppliersTableToolbar({
  table,
  search,
  onSearchChange,
  onCreate,
  onBulkDelete,
}: SuppliersTableToolbarProps) {
  const isFiltered = search.length > 0;

  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      actions={
        hasSelection ? (
          <Button
            size="lg"
            variant="destructive"
            className="shrink-0"
            onClick={() =>
              onBulkDelete(selectedRows.map((row) => row.original))
            }
          >
            <Trash2 className="size-4" />
            <span className="hidden xl:inline">
              Xoá {selectedRows.length} nhà cung cấp
            </span>
            <span className="xl:hidden">Xoá ({selectedRows.length})</span>
          </Button>
        ) : (
          <Button size="lg" className="shrink-0" onClick={onCreate}>
            <Plus className="size-4" />
            <span className="hidden xl:inline">Thêm nhà cung cấp</span>
          </Button>
        )
      }
      columnLabels={supplierColumnLabels}
      onReset={() => onSearchChange("")}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên, email hoặc số điện thoại..."
    />
  );
}
