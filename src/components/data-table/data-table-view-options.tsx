"use client";

import { Settings2 } from "lucide-react";
import { type ReactTable, type RowData } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { type DataTableFeatures } from "./data-table-features";

interface DataTableViewOptionsProps<TData extends RowData> {
  columnLabels?: Record<string, string>;
  table: ReactTable<DataTableFeatures, TData>;
}

export function DataTableViewOptions<TData extends RowData>({
  table,
  columnLabels = {},
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size={"lg"} variant="outline" className="ml-auto">
            <Settings2 className="size-4" />
            Hiển thị
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-37.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Bật/tắt cột</DropdownMenuLabel>

          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnLabels[column.id] ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
