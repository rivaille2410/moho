"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { type RowData, type ReactTable } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

interface DataTableToolbarShellProps<TData extends RowData> {
  search: string;
  isFiltered: boolean;
  onReset: () => void;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  columnLabels?: Record<string, string>;
  onSearchChange: (value: string) => void;
  table: ReactTable<DataTableFeatures, TData>;
}

export function DataTableToolbarShell<TData extends RowData>({
  table,
  search,
  onReset,
  actions,
  children,
  isFiltered,
  onSearchChange,
  columnLabels = {},
  searchPlaceholder = "Tìm kiếm...",
}: DataTableToolbarShellProps<TData>) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              className="pl-8"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {actions}

          {hideableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="lg">
                    <SlidersHorizontal className="size-4" />
                    <span className="hidden sm:inline">Hiển thị</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Hiển thị cột</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hideableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnLabels[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {(children || isFiltered) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <div className="flex shrink-0 items-center gap-2 sm:flex-wrap">
            {children}
          </div>

          {isFiltered && (
            <Button
              size="lg"
              variant="destructive"
              onClick={onReset}
              className="shrink-0"
            >
              <span className="hidden sm:inline">Xoá lọc</span>
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
