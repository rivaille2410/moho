"use client";

import * as React from "react";

import { Trash2Icon } from "lucide-react";

import { Review } from "@/types/review";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useReviews } from "@/features/reviews/hooks/use-reviews";
import { useDeleteReview } from "@/features/reviews/hooks/use-delete-review";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

import { getColumns } from "@/features/reviews/components/columns";
import { ViewReviewDialog } from "@/features/reviews/components/view-review-dialog";
import { ReviewsTableToolbar } from "@/features/reviews/components/reviews-table-toolbar";

const DashboardReviews = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [rating, setRating] = React.useState<number | undefined>(undefined);

  const [reviewToView, setReviewToView] = React.useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = React.useState<Review | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useReviews({
    page,
    limit,
    rating,
    search: debouncedSearch || undefined,
  });

  const deleteReview = useDeleteReview();

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: (review) => setReviewToView(review),
        onDelete: (review) => setReviewToDelete(review),
      }),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRatingChange = (value: number | undefined) => {
    setRating(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!reviewToDelete) return;

    deleteReview.mutate(reviewToDelete.id, {
      onSuccess: () => setReviewToDelete(null),
    });
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
              toolbar={(table) => (
                <ReviewsTableToolbar
                  table={table}
                  search={search}
                  rating={rating}
                  onRatingChange={handleRatingChange}
                  onSearchChange={handleSearchChange}
                />
              )}
            />

            <ViewReviewDialog
              review={reviewToView}
              onOpenChange={(open) => !open && setReviewToView(null)}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!reviewToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá đánh giá?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteReview.isPending}
              onOpenChange={(open) => !open && setReviewToDelete(null)}
              description={
                <>
                  Bạn sắp xoá đánh giá của{" "}
                  <span className="font-medium text-foreground">
                    {reviewToDelete?.author.name}
                  </span>
                  . Hành động này không thể hoàn tác.
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReviews;
