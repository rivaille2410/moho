import { Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CreateVoucherDialog } from "./create-voucher-dialog";

import { VoucherListItem, VoucherStatus } from "@/types/voucher";
import { useExportVouchers } from "@/features/vouchers/hooks/use-export-vouchers";

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

interface VouchersTableToolbarProps {
  search: string;
  status: VoucherStatus | undefined;
  onSearchChange: (value: string) => void;
  onBulkDelete: (vouchers: VoucherListItem[]) => void;
  table: ReactTable<DataTableFeatures, VoucherListItem>;
  onStatusChange: (value: VoucherStatus | undefined) => void;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems: { label: string; value: VoucherStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đang chạy", value: "ACTIVE" },
  { label: "Tạm dừng", value: "PAUSED" },
  { label: "Hết hạn", value: "EXPIRED" },
  { label: "Hết lượt", value: "DEPLETED" },
];

const voucherColumnLabels: Record<string, string> = {
  code: "Mã voucher",
  value: "Giá trị",
  scope: "Phạm vi",
  usedCount: "Đã dùng",
  effectiveStatus: "Trạng thái",
  endAt: "Hết hạn",
  createdAt: "Ngày tạo",
};

export function VouchersTableToolbar({
  table,
  search,
  status,
  onBulkDelete,
  onStatusChange,
  onSearchChange,
}: VouchersTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const { mutate: exportVouchers, isPending: isExporting } =
    useExportVouchers();

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      actions={
        <>
          {selectedCount > 0 && (
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
                Xóa đã chọn ({selectedCount})
              </span>
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className="shrink-0"
            disabled={isExporting}
            onClick={() => exportVouchers({ search, status })}
          >
            {isExporting ? (
              <Spinner className="size-4 text-secondary" />
            ) : (
              <ExcelIcon className="size-5" />
            )}
            <span className="hidden xl:inline">Xuất Excel</span>
          </Button>

          <CreateVoucherDialog />
        </>
      }
      columnLabels={voucherColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo mã hoặc tên voucher..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) =>
          onStatusChange(toFilterValue(value) as VoucherStatus | undefined)
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
