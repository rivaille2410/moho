"use client";

import * as React from "react";

import {
  useTable,
  type ColumnDef,
  type RowData,
  type ReactTable,
  type SortingState,
  type ColumnVisibilityState,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { type PaginationMeta } from "@/types/shared";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  dataTableFeatures,
  DataTableFeatures,
} from "@/components/data-table/data-table-features";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface DataTableProps<TData extends RowData> {
  data: TData[];
  isLoading?: boolean;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  columns: ColumnDef<DataTableFeatures, TData>[];
  toolbar?: (table: ReactTable<DataTableFeatures, TData>) => React.ReactNode;
}

const MIN_SKELETON_ROWS = 16;

const STICKY_LEFT_IDS = new Set(["select"]);
const STICKY_RIGHT_IDS = new Set(["actions"]);

function getStickyClassName(columnId: string) {
  if (STICKY_LEFT_IDS.has(columnId)) {
    return "sticky left-0 z-20 bg-background";
  }

  if (STICKY_RIGHT_IDS.has(columnId)) {
    return "sticky right-0 z-20 bg-background shadow-[-1px_0_0_0_theme(colors.border)]";
  }

  return undefined;
}

export function DataTable<TData extends RowData>({
  meta,
  data,
  columns,
  toolbar,
  isLoading,
  onPageChange,
  onLimitChange,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const table = useTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    features: dataTableFeatures,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const rows = table.getRowModel().rows;
  const isEmpty = !isLoading && rows.length === 0;
  const skeletonRowCount = Math.max(meta.limit, MIN_SKELETON_ROWS);

  React.useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [meta.page]);

  return (
    <div className="flex h-full min-h-0 flex-col space-y-4">
      {toolbar?.(table)}

      <div
        ref={scrollContainerRef}
        className="relative min-h-0 flex-1 overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "bg-background",
                      getStickyClassName(header.column.id),
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: skeletonRowCount }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((column, j) => (
                      <TableCell
                        key={j}
                        className={getStickyClassName(column.id ?? "")}
                      >
                        <Skeleton className="w-full h-6" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "bg-background",
                          getStickyClassName(cell.column.id),
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {isEmpty && (
          <div className="absolute inset-x-0 bottom-0 top-10 flex items-center justify-center text-sm text-muted-foreground">
            Không có dữ liệu.
          </div>
        )}
      </div>

      <div className="shrink-0">
        <DataTablePagination
          meta={meta}
          table={table}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
}
