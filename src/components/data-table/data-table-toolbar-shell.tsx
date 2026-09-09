"use client";

import * as React from "react";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { type RowData, type ReactTable } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

export interface DataTableMobileAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}

interface DataTableToolbarShellProps<TData extends RowData> {
  search: string;
  isFiltered: boolean;
  onReset: () => void;
  actions?: React.ReactNode;
  mobileActions?: DataTableMobileAction[];
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
  mobileActions,
  onSearchChange,
  columnLabels = {},
  searchPlaceholder = "Tìm kiếm...",
}: DataTableToolbarShellProps<TData>) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  const hasColumnVisibility = hideableColumns.length > 0;

  const columnVisibilityMenu = hasColumnVisibility && (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="lg" className="shrink-0">
            <SlidersHorizontal className="size-4" />
            <span className="hidden xl:inline">Hiển thị</span>
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
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnLabels[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const primaryMobileAction =
    mobileActions?.find((a) => a.primary) ?? mobileActions?.[0];
  const restMobileActions =
    mobileActions?.filter((a) => a.key !== primaryMobileAction?.key) ?? [];

  const hasMobileMenuContent =
    !!children || restMobileActions.length > 0 || hasColumnVisibility;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-72 2xl:min-w-96 flex-1 xl:max-w-80 xl:flex-none 2xl:max-w-110">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          className="pl-8"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="hidden shrink-0 items-center gap-2 xl:ml-auto xl:flex">
        {children}

        {isFiltered && (
          <Button
            size="lg"
            variant="destructive"
            className="shrink-0"
            onClick={onReset}
          >
            <span>Xoá lọc</span>
            <X className="size-4" />
          </Button>
        )}

        {actions}
        {columnVisibilityMenu}
      </div>

      <div className="flex shrink-0 items-center gap-2 xl:hidden">
        {primaryMobileAction && (
          <Button
            size="icon-lg"
            variant="default"
            className="shrink-0"
            onClick={primaryMobileAction.onClick}
            aria-label={primaryMobileAction.label}
          >
            {primaryMobileAction.icon}
          </Button>
        )}

        {!mobileActions && actions}

        {hasMobileMenuContent && (
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="relative shrink-0"
                  aria-label="Tuỳ chọn"
                >
                  <SlidersHorizontal className="size-4" />
                  {isFiltered && (
                    <span className="absolute -right-1 -top-1 size-2 rounded-full bg-secondary" />
                  )}
                </Button>
              }
            />
            <PopoverContent align="end" className="w-72">
              {children && (
                <div className="flex flex-col gap-2">{children}</div>
              )}

              {isFiltered && (
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    onReset();
                    setMobileMenuOpen(false);
                  }}
                >
                  <X className="size-4" />
                  Xoá lọc
                </Button>
              )}

              {restMobileActions.length > 0 && (
                <>
                  {(children || isFiltered) && <Separator />}
                  <div className="flex flex-col gap-1">
                    {restMobileActions.map((action) => (
                      <Button
                        key={action.key}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          action.onClick();
                          setMobileMenuOpen(false);
                        }}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {hasColumnVisibility && (
                <div className="space-y-2">
                  <p className="px-1 text-sm font-medium text-muted-foreground">
                    Hiển thị cột
                  </p>
                  {hideableColumns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 rounded-md p-1 hover:bg-accent"
                    >
                      <Checkbox
                        id={`column-${column.id}`}
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) =>
                          column.toggleVisibility(!!checked)
                        }
                      />
                      <Label
                        htmlFor={`column-${column.id}`}
                        className="w-full cursor-pointer text-sm font-normal capitalize"
                      >
                        {columnLabels[column.id] ?? column.id}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
