import { Plus } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import {
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/types/purchase-order";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface PurchaseOrdersTableToolbarProps {
  status: PurchaseOrderStatus | undefined;
  onStatusChange: (value: PurchaseOrderStatus | undefined) => void;
  onCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  table: ReactTable<DataTableFeatures, PurchaseOrder>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Nháp", value: "DRAFT" },
  { label: "Đã đặt", value: "ORDERED" },
  { label: "Nhận một phần", value: "PARTIALLY_RECEIVED" },
  { label: "Đã nhận đủ", value: "RECEIVED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

const poColumnLabels: Record<string, string> = {
  code: "Mã đơn",
  supplierId: "Nhà cung cấp",
  warehouseId: "Kho hàng",
  status: "Trạng thái",
  expectedAt: "Ngày dự kiến",
  createdAt: "Ngày tạo",
};

export function PurchaseOrdersTableToolbar({
  table,
  status,
  onStatusChange,
  onCreate,
  search,
  onSearchChange,
}: PurchaseOrdersTableToolbarProps) {
  const isFiltered = !!status || !!search;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      onSearchChange={onSearchChange}
      actions={
        <Button size="lg" className="shrink-0" onClick={onCreate}>
          <Plus className="size-4" />
          <span className="hidden xl:inline">Tạo đơn nhập hàng</span>
        </Button>
      }
      columnLabels={poColumnLabels}
      onReset={() => onStatusChange(undefined)}
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) => {
          onStatusChange(
            toFilterValue(value) as PurchaseOrderStatus | undefined,
          );
        }}
      >
        <SelectTrigger className="w-full lg:w-fit">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {statusItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
