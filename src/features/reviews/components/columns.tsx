"use client";

import Link from "next/link";

import {
  Eye,
  Copy,
  Star,
  Trash2,
  BadgeCheck,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { type Review } from "@/types/review";

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

import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const columnHelper = createColumnHelper<DataTableFeatures, Review>();

interface ColumnsOptions {
  onView: (review: Review) => void;
  onDelete: (review: Review) => void;
}

function handleCopyId(id: string, label: string) {
  navigator.clipboard.writeText(id);
  toast.add({ type: "success", description: `Đã sao chép ${label}` });
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < value
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/25",
          )}
        />
      ))}
    </div>
  );
}

export const getColumns = ({ onView, onDelete }: ColumnsOptions) =>
  columnHelper.columns([
    columnHelper.accessor("author", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người đánh giá" />
      ),
      cell: ({ row }) => {
        const { author, verifiedPurchase } = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium line-clamp-1">{author.name}</span>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-normal",
                  author.isRegisteredUser
                    ? "border-secondary/20 bg-secondary/10 text-secondary"
                    : "border-muted-foreground/20 bg-muted text-muted-foreground",
                )}
              >
                {author.isRegisteredUser ? "Thành viên" : "Khách"}
              </Badge>
              {verifiedPurchase && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600"
                >
                  <BadgeCheck className="size-3" />
                  Đã mua hàng
                </Badge>
              )}
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("rating", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đánh giá" />
      ),
      cell: ({ row }) => <RatingStars value={row.getValue("rating")} />,
    }),

    columnHelper.accessor("content", {
      header: "Nội dung",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="line-clamp-2 max-w-xs text-left text-sm hover:text-secondary"
        >
          {row.getValue("content")}
        </button>
      ),
    }),

    columnHelper.accessor("product", {
      header: "Sản phẩm",
      cell: ({ row }) => {
        const { product } = row.original;
        return (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="line-clamp-1 max-w-40 text-sm hover:text-secondary hover:underline"
            title={product.name}
          >
            {product.name}
          </Link>
        );
      },
    }),

    columnHelper.accessor("helpfulCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hữu ích" />
      ),
      cell: ({ row }) => <span>{row.getValue("helpfulCount")}</span>,
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
        const review = row.original;

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
                <DropdownMenuItem
                  onClick={() => handleCopyId(review.id, "ID đánh giá")}
                >
                  <Copy />
                  Copy ID đánh giá
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(review)}>
                  <Eye />
                  Xem chi tiết
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(review)}
              >
                <Trash2 />
                Xoá đánh giá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
