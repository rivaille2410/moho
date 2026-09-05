import { type ReactTable } from "@tanstack/react-table";

import { type Order } from "@/types/order";
import { useExportOrders } from "@/features/orders/hooks/use-export-orders";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ExcelIcon } from "@/components/icons/excel-icon";
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

  const { mutate: exportOrders, isPending: isExporting } = useExportOrders();

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      actions={
        <Button
          size="lg"
          variant="outline"
          className="shrink-0"
          disabled={isExporting}
          onClick={() => exportOrders({ search, status })}
        >
          {isExporting ? (
            <Spinner className="size-4 text-secondary" />
          ) : (
            <ExcelIcon className="size-5" />
          )}
          <span className="hidden xl:inline">Xuất Excel</span>
        </Button>
      }
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
