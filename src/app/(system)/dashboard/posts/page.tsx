"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { PostListItem, PostStatus } from "@/types/post";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDeletePost } from "@/features/posts/hooks/use-delete-post";
import { useBulkDeletePosts } from "@/features/posts/hooks/use-bulk-delete-post";
import { useUpdatePostStatus } from "@/features/posts/hooks/use-update-post-status";

import { getColumns } from "@/features/posts/components/columns";
import { PostsTableToolbar } from "@/features/posts/components/posts-table-toolbar";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

const DashboardPosts = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<PostStatus | undefined>(undefined);
  const [postToDelete, setPostToDelete] = React.useState<PostListItem | null>(
    null,
  );
  const [postsToBulkDelete, setPostsToBulkDelete] = React.useState<
    PostListItem[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    PostListItem
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = usePosts({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const deletePost = useDeletePost();
  const updateStatus = useUpdatePostStatus();
  const bulkDeletePost = useBulkDeletePosts();

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (post: PostListItem) => {
          router.push(`/dashboard/posts/${post.id}`);
        },
        onDelete: (post: PostListItem) => setPostToDelete(post),
        onChangeStatus: (post: PostListItem, newStatus: string) =>
          updateStatus.mutate({
            id: post.id,
            status: newStatus as PostStatus,
          }),
      }),
    [router, updateStatus],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: PostStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!postToDelete) return;

    deletePost.mutate(postToDelete.id, {
      onSuccess: () => setPostToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!postsToBulkDelete) return;

    bulkDeletePost.mutate(
      postsToBulkDelete.map((post) => post.id),
      {
        onSuccess: () => {
          setPostsToBulkDelete(null);
          tableRef.current?.resetRowSelection();
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="@container/main flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 min-h-0">
          <div className="flex h-full min-h-0 flex-col">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              meta={
                data?.meta ?? {
                  page,
                  limit,
                  totalItems: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPreviousPage: false,
                }
              }
              isLoading={isLoading}
              onPageChange={setPage}
              onLimitChange={(value) => {
                setPage(1);
                setLimit(value);
              }}
              toolbar={(table) => {
                tableRef.current = table;

                return (
                  <PostsTableToolbar
                    table={table}
                    search={search}
                    status={status}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                    onBulkDelete={(posts) => setPostsToBulkDelete(posts)}
                  />
                );
              }}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!postToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá bài viết?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deletePost.isPending}
              onOpenChange={(open) => !open && setPostToDelete(null)}
              description={
                <>
                  Bạn sắp xoá bài viết{" "}
                  <span className="font-medium text-foreground">
                    {postToDelete?.title}
                  </span>
                  . Bài viết có thể được khôi phục sau nếu cần.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!postsToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeletePost.isPending}
              title={`Xoá ${postsToBulkDelete?.length ?? 0} bài viết?`}
              onOpenChange={(open) => !open && setPostsToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {postsToBulkDelete?.length ?? 0} bài viết
                  </span>{" "}
                  đã chọn.
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPosts;
