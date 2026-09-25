import { type ReactTable } from "@tanstack/react-table";

import { Shipment, ShipmentStatus } from "@/types/shipment";
import { CreateShipmentDialog } from "./create-shipment-dialog";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface ShipmentsTableToolbarProps {
  search: string;
  status: ShipmentStatus | undefined;
  onSearchChange: (value: string) => void;
  table: ReactTable<DataTableFeatures, Shipment>;
  onStatusChange: (value: ShipmentStatus | undefined) => void;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems: { label: string; value: ShipmentStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang chuẩn bị", value: "PREPARING" },
  { label: "Đang giao", value: "IN_TRANSIT" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Giao thất bại", value: "FAILED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

const shipmentColumnLabels: Record<string, string> = {
  code: "Mã vận đơn",
  orderId: "Đơn hàng",
  status: "Trạng thái",
  scheduledAt: "Ngày dự kiến",
  createdAt: "Ngày tạo",
};

export function ShipmentsTableToolbar({
  table,
  search,
  status,
  onStatusChange,
  onSearchChange,
}: ShipmentsTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      actions={<CreateShipmentDialog />}
      columnLabels={shipmentColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo mã vận đơn..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) =>
          onStatusChange(toFilterValue(value) as ShipmentStatus | undefined)
        }
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
