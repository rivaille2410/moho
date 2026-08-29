import { type ReactTable } from "@tanstack/react-table";

import { type Order } from "@/types/order";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface OrdersTableToolbarProps {
  search: string;
  status: string | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  table: ReactTable<DataTableFeatures, Order>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang xử lý", value: "PROCESSING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

const orderColumnLabels: Record<string, string> = {
  orderNumber: "Mã đơn",
  recipientName: "Người đặt",
  status: "Trạng thái",
  items: "Sản phẩm",
  total: "Tổng tiền",
  createdAt: "Ngày đặt",
};

export function OrdersTableToolbar({
  table,
  search,
  status,
  onStatusChange,
  onSearchChange,
}: OrdersTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      columnLabels={orderColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo mã đơn, tên hoặc số điện thoại..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) => {
          onStatusChange(toFilterValue(value));
        }}
      >
        <SelectTrigger className="w-fit">
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
