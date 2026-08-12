"use client";

import {
  Copy,
  Trash2,
  UserCog,
  XCircle,
  ShieldCheck,
  ShieldOff,
  ShieldBan,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { type UserListItem } from "@/features/users/hooks/use-users";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, UserListItem>();

const roleLabel: Record<string, string> = {
  ADMIN: "Quản trị viên",
  CUSTOMER: "Người dùng",
};

interface ColumnsOptions {
  onDelete: (user: UserListItem) => void;
  onEditRole: (user: UserListItem) => void;
  onBan: (user: UserListItem) => void;
  onUnban: (user: UserListItem) => void;
  // id của user đang đăng nhập, dùng để chặn tự đổi role / tự xoá chính mình
  currentUserId?: string;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID người dùng" });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({
  onEditRole,
  onDelete,
  onBan,
  onUnban,
  currentUserId,
}: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Chọn tất cả"
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Chọn dòng"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),

    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === currentUserId;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {user.name}
              {isSelf && (
                <span className="ml-1.5 text-xs text-secondary font-normal">
                  (Bạn)
                </span>
              )}
            </span>
          </div>
        );
      },
    }),

    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <span>{row.getValue("email")}</span>,
    }),

    columnHelper.accessor("role", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vai trò" />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const isAdmin = role === "ADMIN";

        return (
          <div
            className={cn(
              "flex items-center gap-1.5",
              isAdmin && "text-secondary font-medium",
            )}
          >
            {isAdmin && <ShieldCheck className="size-4" />}
            <span>{roleLabel[role] ?? role}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor("emailVerified", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Xác thực" />
      ),
      cell: ({ row }) => {
        const verified = row.getValue("emailVerified") as boolean;

        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1 font-medium",
              verified
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : "border-muted-foreground/20 bg-muted text-muted-foreground",
            )}
          >
            {verified ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <XCircle className="size-3" />
            )}
            {verified ? "Đã xác thực" : "Chưa xác thực"}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("bannedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const bannedAt = row.getValue("bannedAt") as string | null;
        const isBanned = !!bannedAt;

        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1 font-medium",
              isBanned
                ? "border-destructive/20 bg-destructive/10 text-destructive"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
            )}
          >
            {isBanned ? (
              <ShieldBan className="size-3" />
            ) : (
              <ShieldCheck className="size-3" />
            )}
            {isBanned ? "Đã khoá" : "Hoạt động"}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tham gia" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === currentUserId;
        const isAdmin = user.role === "ADMIN";
        const isBanned = !!user.bannedAt;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size={"icon-lg"} variant="ghost">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleCopyId(user.id)}>
                  <Copy />
                  Copy ID người dùng
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {!isSelf && (
                  <DropdownMenuItem onClick={() => onEditRole(user)}>
                    <UserCog />
                    Đổi vai trò
                  </DropdownMenuItem>
                )}

                {!isSelf && !isAdmin && !isBanned && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onBan(user)}
                  >
                    <ShieldBan />
                    Khoá tài khoản
                  </DropdownMenuItem>
                )}

                {!isSelf && !isAdmin && isBanned && (
                  <DropdownMenuItem onClick={() => onUnban(user)}>
                    <ShieldOff />
                    Mở khoá tài khoản
                  </DropdownMenuItem>
                )}

                {!isSelf && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 />
                    Xoá người dùng
                  </DropdownMenuItem>
                )}

                {isSelf && (
                  <DropdownMenuItem disabled>
                    Không có hành động nào khả dụng cho tài khoản của bạn
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
