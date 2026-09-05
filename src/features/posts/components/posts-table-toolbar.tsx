import { Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CreatePostDialog } from "./create-post-dialog";

import { PostListItem, PostStatus } from "@/types/post";
import { useExportPosts } from "@/features/posts/hooks/use-export-posts";

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

interface PostsTableToolbarProps {
  search: string;
  status: PostStatus | undefined;
  onSearchChange: (value: string) => void;
  onBulkDelete: (posts: PostListItem[]) => void;
  table: ReactTable<DataTableFeatures, PostListItem>;
  onStatusChange: (value: PostStatus | undefined) => void;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const statusItems: { label: string; value: PostStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã đăng", value: "PUBLISHED" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

const postColumnLabels: Record<string, string> = {
  title: "Bài viết",
  viewCount: "Lượt xem",
  status: "Trạng thái",
  publishedAt: "Ngày đăng",
  createdAt: "Ngày tạo",
};

export function PostsTableToolbar({
  table,
  search,
  status,
  onBulkDelete,
  onStatusChange,
  onSearchChange,
}: PostsTableToolbarProps) {
  const isFiltered = search.length > 0 || !!status;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const { mutate: exportPosts, isPending: isExporting } = useExportPosts();

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
              className="shrink-0"
              onClick={() =>
                onBulkDelete(selectedRows.map((row) => row.original))
              }
            >
              <Trash2 className="size-4" />
              <span className="hidden xl:inline">
                Xoá đã chọn ({selectedCount})
              </span>
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className="shrink-0"
            disabled={isExporting}
            onClick={() => exportPosts({ search, status })}
          >
            {isExporting ? (
              <Spinner className="size-4 text-secondary" />
            ) : (
              <ExcelIcon className="size-5" />
            )}
            <span className="hidden xl:inline">Xuất Excel</span>
          </Button>

          <CreatePostDialog />
        </>
      }
      columnLabels={postColumnLabels}
      onReset={() => {
        onSearchChange("");
        onStatusChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tiêu đề..."
    >
      <Select
        items={statusItems}
        value={status ?? "all"}
        onValueChange={(value: string | null) =>
          onStatusChange(toFilterValue(value) as PostStatus | undefined)
        }
      >
        <SelectTrigger className="w-full lg:w-fit">
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
    </DataTableToolbarShell>
  );
}
