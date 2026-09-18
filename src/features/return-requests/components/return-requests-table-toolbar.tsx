import { type ReactTable } from "@tanstack/react-table";

import { ReturnRequestListItem, ReturnStatus } from "@/types/return-request";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface ReturnRequestsTableToolbarProps {
  search: string;
  status: ReturnStatus | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ReturnStatus | undefined) => void;
  table: ReactTable<DataTableFeatures, ReturnRequestListItem>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems: { label: string; value: ReturnStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Từ chối", value: "REJECTED" },
  { label: "Đã nhận hàng", value: "ITEM_RECEIVED" },
  { label: "Đã hoàn tiền", value: "REFUNDED" },
  { label: "Hoàn tất", value: "COMPLETED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

const returnRequestColumnLabels: Record<string, string> = {
  code: "Mã yêu cầu",
  customerName: "Khách hàng",
  reason: "Lý do",
  refundAmount: "Số tiền hoàn",
  status: "Trạng thái",
  createdAt: "Ngày tạo",
};

export function ReturnRequestsTableToolbar({
  table,
  search,
  status,
  onStatusChange,
  onSearchChange,
}: ReturnRequestsTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      columnLabels={returnRequestColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo mã yêu cầu hoặc mã đơn hàng..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) =>
          onStatusChange(toFilterValue(value) as ReturnStatus | undefined)
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
