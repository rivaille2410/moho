"use client";

import { FileSpreadsheet, Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CreateUserDialog } from "./create-user-dialog";
import { type UserListItem } from "@/features/users/hooks/use-users";
import { useExportUsers } from "@/features/users/hooks/use-export-users";

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

interface UsersTableToolbarProps {
  search: string;
  role: string | undefined;
  banned: boolean | undefined;
  emailVerified: boolean | undefined;
  onSearchChange: (value: string) => void;
  onBulkDelete: (users: UserListItem[]) => void;
  onRoleChange: (value: string | undefined) => void;
  table: ReactTable<DataTableFeatures, UserListItem>;
  onBannedChange: (value: boolean | undefined) => void;
  onEmailVerifiedChange: (value: boolean | undefined) => void;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const roleItems = [
  { label: "Tất cả vai trò", value: "all" },
  { label: "Quản trị viên", value: "ADMIN" },
  { label: "Người dùng", value: "CUSTOMER" },
];

const emailVerifiedItems = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đã xác thực", value: "true" },
  { label: "Chưa xác thực", value: "false" },
];

const bannedItems = [
  { label: "Tất cả tài khoản", value: "all" },
  { label: "Hoạt động", value: "false" },
  { label: "Đã khoá", value: "true" },
];

const userColumnLabels: Record<string, string> = {
  name: "Tên",
  email: "Email",
  role: "Vai trò",
  bannedAt: "Trạng thái",
  emailVerified: "Xác thực",
  createdAt: "Ngày tham gia",
};

export function UsersTableToolbar({
  role,
  table,
  search,
  banned,
  emailVerified,
  onRoleChange,
  onBulkDelete,
  onSearchChange,
  onBannedChange,
  onEmailVerifiedChange,
}: UsersTableToolbarProps) {
  const isFiltered =
    search.length > 0 ||
    !!role ||
    emailVerified !== undefined ||
    banned !== undefined;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();

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
            onClick={() => exportUsers({ search, role, banned, emailVerified })}
          >
            {isExporting ? (
              <Spinner className="size-4 text-secondary" />
            ) : (
              <ExcelIcon className="size-4.5" />
            )}
            Xuất Excel
          </Button>

          <CreateUserDialog />
        </>
      }
      columnLabels={userColumnLabels}
      onReset={() => {
        onSearchChange("");
        onRoleChange(undefined);
        onBannedChange(undefined);
        onEmailVerifiedChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên hoặc email..."
    >
      <Select
        items={roleItems}
        value={role ?? "all"}
        onValueChange={(value: string | null) =>
          onRoleChange(toFilterValue(value))
        }
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          {roleItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={emailVerifiedItems}
        value={emailVerified === undefined ? "all" : String(emailVerified)}
        onValueChange={(value: string | null) => {
          const filterValue = toFilterValue(value);
          onEmailVerifiedChange(
            filterValue === undefined ? undefined : filterValue === "true",
          );
        }}
      >
        <SelectTrigger className="w-fit h-8">
          <SelectValue placeholder="Xác thực" />
        </SelectTrigger>
        <SelectContent>
          {emailVerifiedItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={bannedItems}
        value={banned === undefined ? "all" : String(banned)}
        onValueChange={(value: string | null) => {
          const filterValue = toFilterValue(value);
          onBannedChange(
            filterValue === undefined ? undefined : filterValue === "true",
          );
        }}
      >
        <SelectTrigger className="w-fit h-8">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {bannedItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
