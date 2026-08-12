"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { type ReactTable, type RowData } from "@tanstack/react-table";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { type PaginationMeta } from "@/types/shared";
import { type DataTableFeatures } from "./data-table-features";

interface DataTablePaginationProps<TData extends RowData> {
  meta: PaginationMeta;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  table: ReactTable<DataTableFeatures, TData>;
}

export function DataTablePagination<TData extends RowData>({
  meta,
  table,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 25, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground text-center sm:text-left sm:flex-1">
        {table.getFilteredSelectedRowModel().rows.length} / {meta.totalItems}{" "}
        dòng được chọn.
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <p className="text-sm font-medium whitespace-nowrap">
            Số dòng / trang
          </p>
          <Select
            value={`${meta.limit}`}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-17.5 h-8">
              <SelectValue placeholder={meta.limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center gap-4 sm:justify-between sm:gap-0">
          <div className="w-auto sm:w-25 flex items-center justify-center text-sm font-medium whitespace-nowrap">
            Trang {meta.page} / {meta.totalPages || 1}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onPageChange(1)}
              disabled={!meta.hasPreviousPage}
              className="hidden size-8 sm:flex"
            >
              <span className="sr-only">Về trang đầu</span>
              <ChevronsLeft />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="size-8"
              disabled={!meta.hasPreviousPage}
              onClick={() => onPageChange(meta.page - 1)}
            >
              <span className="sr-only">Trang trước</span>
              <ChevronLeft />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="size-8"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(meta.page + 1)}
            >
              <span className="sr-only">Trang sau</span>
              <ChevronRight />
            </Button>

            <Button
              size="icon"
              variant="outline"
              disabled={!meta.hasNextPage}
              className="hidden size-8 sm:flex"
              onClick={() => onPageChange(meta.totalPages)}
            >
              <span className="sr-only">Về trang cuối</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
