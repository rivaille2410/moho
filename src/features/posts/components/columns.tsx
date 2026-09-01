"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Eye,
  Copy,
  Send,
  Trash2,
  Archive,
  FileEdit,
  PenLine,
  ImageOff,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { type PostListItem } from "@/types/post";

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, PostListItem>();

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã đăng",
  ARCHIVED: "Đã lưu trữ",
};

const statusStyle: Record<string, string> = {
  DRAFT: "border-muted-foreground/20 bg-muted text-muted-foreground",
  PUBLISHED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  ARCHIVED: "border-destructive/20 bg-destructive/10 text-destructive",
};

const statusIcon: Record<string, React.ElementType> = {
  DRAFT: FileEdit,
  PUBLISHED: Send,
  ARCHIVED: Archive,
};

interface ColumnsOptions {
  onEdit: (post: PostListItem) => void;
  onDelete: (post: PostListItem) => void;
  onChangeStatus: (post: PostListItem, status: string) => void;
}

function handleCopyId(id: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: "Đã sao chép ID bài viết" });
}

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getColumns = ({
  onEdit,
  onDelete,
  onChangeStatus,
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

    columnHelper.accessor("title", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bài viết" />
      ),
      cell: ({ row }) => {
        const post = row.original;

        return (
          <Link
            href={`/dashboard/posts/${post.id}`}
            className="flex items-center gap-3 group/post-link"
          >
            <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-sm border bg-muted">
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageOff className="size-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium line-clamp-1 group-hover/post-link:text-secondary transition">
                {post.title}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                /{post.slug}
              </span>
            </div>
          </Link>
        );
      },
    }),

    columnHelper.accessor("viewCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lượt xem" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="size-3.5" />
          <span>{row.getValue("viewCount")}</span>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="outline"
            className={cn("font-medium", statusStyle[status])}
          >
            {statusLabel[status] ?? status}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("publishedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày đăng" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("publishedAt"))}</span>,
    }),

    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => <span>{formatDate(row.getValue("createdAt"))}</span>,
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const post = row.original;

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
                <DropdownMenuItem onClick={() => handleCopyId(post.id)}>
                  <Copy />
                  Copy ID bài viết
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(post)}>
                  <PenLine />
                  Chỉnh sửa
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Đổi trạng thái
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(["DRAFT", "PUBLISHED", "ARCHIVED"] as const)
                      .filter((status) => status !== post.status)
                      .map((status) => {
                        const Icon = statusIcon[status];
                        return (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onChangeStatus(post, status)}
                          >
                            <Icon className="size-4" />
                            {statusLabel[status]}
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(post)}
                >
                  <Trash2 />
                  Xoá bài viết
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
