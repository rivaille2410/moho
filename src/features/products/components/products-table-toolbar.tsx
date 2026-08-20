import { Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CreateProductDialog } from "./create-product-dialog";

import { ProductListItem, ProductStatus } from "@/types/product";
import { useExportProducts } from "@/features/products/hooks/use-export-products";

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

interface ProductsTableToolbarProps {
  search: string;
  status: ProductStatus | undefined;
  categoryId: string | undefined;
  outOfStock: boolean | undefined;
  onSearchChange: (value: string) => void;
  onBulkDelete: (products: ProductListItem[]) => void;
  onCategoryChange: (value: string | undefined) => void;
  table: ReactTable<DataTableFeatures, ProductListItem>;
  onOutOfStockChange: (value: boolean | undefined) => void;
  onStatusChange: (value: ProductStatus | undefined) => void;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems: { label: string; value: ProductStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Ngừng bán", value: "ARCHIVED" },
];

const stockItems = [
  { label: "Tất cả tồn kho", value: "all" },
  { label: "Còn hàng", value: "false" },
  { label: "Hết hàng", value: "true" },
];

const productColumnLabels: Record<string, string> = {
  name: "Sản phẩm",
  price: "Giá",
  totalStock: "Tồn kho",
  soldCount: "Đã bán",
  status: "Trạng thái",
  createdAt: "Ngày tạo",
};

export function ProductsTableToolbar({
  table,
  search,
  status,
  outOfStock,
  onBulkDelete,
  onStatusChange,
  onSearchChange,
  onOutOfStockChange,
}: ProductsTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status || outOfStock !== undefined;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const { mutate: exportProducts, isPending: isExporting } =
    useExportProducts();

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
              onClick={() =>
                onBulkDelete(selectedRows.map((row) => row.original))
              }
            >
              <Trash2 className="size-4" />
              Xoá đã chọn ({selectedCount})
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            disabled={isExporting}
            onClick={() => exportProducts({ search, status, outOfStock })}
          >
            {isExporting ? (
              <Spinner className="size-4 text-secondary" />
            ) : (
              <ExcelIcon className="size-4.5" />
            )}
            Xuất Excel
          </Button>

          <CreateProductDialog />
        </>
      }
      columnLabels={productColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
        onOutOfStockChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên hoặc SKU..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) =>
          onStatusChange(toFilterValue(value) as ProductStatus | undefined)
        }
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

      <Select
        items={stockItems}
        value={outOfStock === undefined ? "all" : String(outOfStock)}
        onValueChange={(value: string | null) => {
          const filterValue = toFilterValue(value);
          onOutOfStockChange(
            filterValue === undefined ? undefined : filterValue === "true",
          );
        }}
      >
        <SelectTrigger className="w-fit h-8">
          <SelectValue placeholder="Tồn kho" />
        </SelectTrigger>
        <SelectContent>
          {stockItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
