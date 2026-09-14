import { Plus } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import {
  type StockMovement,
  type StockMovementType,
} from "@/types/stock-movement";

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

interface StockMovementsTableToolbarProps {
  type: StockMovementType | undefined;
  onTypeChange: (value: StockMovementType | undefined) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  onCreate: () => void;
  table: ReactTable<DataTableFeatures, StockMovement>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const typeItems = [
  { label: "Tất cả loại", value: "all" },
  { label: "Nhập hàng", value: "PURCHASE_IN" },
  { label: "Bán hàng", value: "SALE_OUT" },
  { label: "Trả hàng", value: "RETURN_IN" },
  { label: "Điều chỉnh", value: "ADJUSTMENT" },
  { label: "Hàng hỏng", value: "DAMAGED_OUT" },
  { label: "Chuyển đến", value: "TRANSFER_IN" },
  { label: "Chuyển đi", value: "TRANSFER_OUT" },
];

const stockMovementColumnLabels: Record<string, string> = {
  variantId: "Sản phẩm",
  warehouseId: "Kho hàng",
  type: "Loại",
  quantity: "Số lượng",
  note: "Ghi chú",
  createdAt: "Thời gian",
};

export function StockMovementsTableToolbar({
  table,
  type,
  onTypeChange,
  search,
  onSearchChange,
  onReset,
  onCreate,
}: StockMovementsTableToolbarProps) {
  const isFiltered = !!type || !!search;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      onSearchChange={onSearchChange}
      actions={
        <Button size="lg" className="shrink-0" onClick={onCreate}>
          <Plus className="size-4" />
          <span className="hidden xl:inline">Điều chỉnh tồn kho</span>
        </Button>
      }
      columnLabels={stockMovementColumnLabels}
      onReset={onReset}
    >
      <Select
        items={typeItems}
        value={type ?? "all"}
        onValueChange={(value: string | null) => {
          onTypeChange(toFilterValue(value) as StockMovementType | undefined);
        }}
      >
        <SelectTrigger className="w-full lg:w-fit">
          <SelectValue placeholder="Loại" />
        </SelectTrigger>
        <SelectContent>
          {typeItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
