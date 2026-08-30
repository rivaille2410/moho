"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Star,
  Send,
  Heart,
  Trash2,
  ThumbsUp,
  UserRound,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  MoreHorizontal,
  MessageSquareText,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { ReviewComment } from "@/types/review-comment";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

import {
  fetchComments,
  useReviewComments,
  reviewCommentsQueryKey,
} from "@/features/comments/hooks/use-review-comments";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useDeleteReview } from "@/features/reviews/hooks/use-delete-review";
import { useCreateReviewComment } from "@/features/comments/hooks/use-create-review-comment";
import { useDeleteReviewComment } from "@/features/comments/hooks/use-delete-review-comment";

export interface ProductReviewAuthor {
  id: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  memberSinceYears: number;
  reviewCount: number;
  thanksCount: number;
}

export interface ProductReviewCommentPreview {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; avatarUrl?: string | null };
}

export interface ProductReview {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: ProductReviewAuthor;
  verifiedPurchase: boolean;
  variantInfo?: { label: string; value: string; colorHex?: string | null }[];
  createdAtLabel: string;
  usedForLabel?: string;
  helpfulCount: number;
  commentCount: number;
  content?: string;
  images?: string[];
  isHelpfulByCurrentUser?: boolean;
  comments?: ProductReviewCommentPreview[];
}

export interface ProductReviewSummary {
  average: number;
  total: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

interface ProductReviewsProps {
  slug: string;
  reviews: ProductReview[];
  summary: ProductReviewSummary;
  className?: string;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onToggleHelpful?: (reviewId: string) => void;
  helpfulPendingId?: string | null;
}

const RATING_LABELS: Record<number, string> = {
  5: "Cực kì hài lòng",
  4: "Hài lòng",
  3: "Bình thường",
  2: "Không hài lòng",
  1: "Rất không hài lòng",
};

const VARIANT_LABEL_MAP: Record<string, string> = {
  Variant: "Màu",
};

const COMMENTS_PAGE = 1;
const COMMENTS_PAGE_LIMIT = 10;
const COMMENTS_PREFETCH_STALE_TIME = 30_000;

function displayVariantLabel(label: string) {
  return VARIANT_LABEL_MAP[label] ?? label;
}

function formatCommentDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type FilterKey = "moi-nhat" | "hinh-anh" | "da-mua" | 5 | 4 | 3 | 2 | 1;

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i < value
              ? "fill-secondary text-secondary"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function CommentPreviewList({
  comments,
  totalCount,
  onViewAll,
}: {
  comments: ProductReviewCommentPreview[];
  totalCount: number;
  onViewAll: () => void;
}) {
  return (
    <div className="mt-3 space-y-2.5 rounded-md bg-muted/40 p-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          <Avatar className="size-6 shrink-0">
            <AvatarImage
              src={comment.author.avatarUrl ?? undefined}
              alt={comment.author.name}
            />
            <AvatarFallback className="bg-secondary/10 text-[10px] font-semibold text-secondary">
              {initials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <p className="min-w-0 flex-1 text-sm leading-relaxed">
            <span className="font-semibold">{comment.author.name}</span>{" "}
            <span className="text-muted-foreground">{comment.content}</span>
          </p>
        </div>
      ))}

      {totalCount > comments.length ? (
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-[13px] font-medium text-secondary"
        >
          Xem tất cả {totalCount} bình luận
          <ChevronDown className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function CommentRow({
  comment,
  currentUserId,
  canModerate,
  isReply = false,
  onReply,
  onDelete,
  isDeleting,
}: {
  comment: ReviewComment;
  currentUserId?: string;
  canModerate: boolean;
  isReply?: boolean;
  onReply?: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const wasDeletingRef = useRef(false);

  const isDeleted = comment.isDeleted;
  const isOwnComment = comment.author.id === currentUserId;
  const canDelete = !isDeleted && (canModerate || isOwnComment);

  useEffect(() => {
    if (wasDeletingRef.current && !isDeleting) {
      setConfirmDeleteOpen(false);
    }
    wasDeletingRef.current = isDeleting;
  }, [isDeleting]);

  const handleConfirmDelete = () => {
    onDelete(comment.id);
  };

  return (
    <div className={cn("flex gap-3", isReply && "mt-3")}>
      <Avatar className="size-8 shrink-0">
        <AvatarImage
          src={comment.author.avatarUrl ?? undefined}
          alt={comment.author.name}
        />
        <AvatarFallback className="bg-secondary/10 text-xs font-semibold text-secondary">
          {initials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-sm font-semibold">{comment.author.name}</p>
            {isOwnComment ? (
              <Badge
                variant="outline"
                className="h-4.5 gap-1 border-secondary/30 bg-secondary/10 px-1.5 text-[10px] font-normal text-secondary"
              >
                Bạn
              </Badge>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {formatCommentDate(comment.createdAt)}
            </p>
          </div>

          {canDelete ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    className="size-6 shrink-0 p-0 text-muted-foreground hover:bg-transparent hover:text-secondary"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Xóa bình luận
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="size-6 shrink-0" />
          )}
        </div>

        {isDeleted ? (
          <p className="mt-0.5 text-sm italic text-muted-foreground">
            Bình luận đã bị xóa
          </p>
        ) : (
          <p className="mt-0.5 text-sm leading-relaxed">{comment.content}</p>
        )}

        {!isReply && comment.replies.length > 0 ? (
          <div className="mt-1 border-l border-border pl-4">
            {comment.replies.map((reply) => (
              <CommentRow
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                canModerate={canModerate}
                isReply
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        ) : null}
      </div>

      <ConfirmActionDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        icon={<Trash2 className="size-5" />}
        title="Xóa bình luận"
        description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        pendingLabel="Đang xóa..."
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}

function CommentRowSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}

function ReviewCommentThread({
  slug,
  reviewId,
  currentUserId,
  canModerate,
  canComment,
  onClose,
}: {
  slug: string;
  reviewId: string;
  currentUserId?: string;
  canModerate: boolean;
  canComment: boolean;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useReviewComments({
    slug,
    reviewId,
    page: COMMENTS_PAGE,
    limit: COMMENTS_PAGE_LIMIT,
  });
  const createComment = useCreateReviewComment();
  const deleteComment = useDeleteReviewComment();

  const replyTarget = useMemo(
    () => data?.data.find((c) => c.id === replyToId) ?? null,
    [data, replyToId],
  );

  const handleSubmit = () => {
    const content = draft.trim();
    if (!content) return;

    createComment.mutate(
      { slug, reviewId, content, parentId: replyToId ?? undefined },
      {
        onSuccess: () => {
          setDraft("");
          setReplyToId(null);
        },
      },
    );
  };

  const handleDelete = (commentId: string) => {
    setDeletingId(commentId);
    deleteComment.mutate(
      { slug, reviewId, commentId },
      { onSettled: () => setDeletingId(null) },
    );
  };

  const handleCancel = () => {
    setDraft("");
    setReplyToId(null);
    onClose();
  };

  return (
    <div className="mt-3 space-y-3">
      {isLoading ? (
        <div className="space-y-4">
          <CommentRowSkeleton />
          <CommentRowSkeleton />
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              canModerate={canModerate}
              onReply={setReplyToId}
              onDelete={handleDelete}
              isDeleting={deletingId === comment.id}
            />
          ))}
        </div>
      ) : null}

      {canComment ? (
        <div className="space-y-2">
          {replyTarget ? (
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              <span>
                Đang trả lời <strong>{replyTarget.author.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setReplyToId(null)}
                className="font-medium hover:text-secondary"
              >
                Hủy
              </button>
            </div>
          ) : null}
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              replyTarget
                ? `Trả lời ${replyTarget.author.name}...`
                : "Viết bình luận của bạn..."
            }
            className="min-h-20 resize-none"
            disabled={createComment.isPending}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={createComment.isPending}
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={createComment.isPending || !draft.trim()}
              onClick={handleSubmit}
            >
              {createComment.isPending ? <Spinner /> : <Send />}
              {createComment.isPending ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ProductReviews({
  slug,
  reviews,
  summary,
  className,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onToggleHelpful,
  helpfulPendingId,
}: ProductReviewsProps) {
  const [filter, setFilter] = useState<FilterKey>("moi-nhat");
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const queryClient = useQueryClient();
  const deleteReview = useDeleteReview();

  const filteredReviews = useMemo(() => {
    switch (filter) {
      case "hinh-anh":
        return reviews.filter((r) => r.images && r.images.length > 0);
      case "da-mua":
        return reviews.filter((r) => r.verifiedPurchase);
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
        return reviews.filter((r) => r.rating === filter);
      case "moi-nhat":
      default:
        return reviews;
    }
  }, [reviews, filter]);

  const filterChips: { key: FilterKey; label: string }[] = [
    { key: "moi-nhat", label: "Mới nhất" },
    { key: "hinh-anh", label: "Có hình ảnh" },
    { key: "da-mua", label: "Đã mua hàng" },
    { key: 5, label: "5 sao" },
    { key: 4, label: "4 sao" },
    { key: 3, label: "3 sao" },
    { key: 2, label: "2 sao" },
    { key: 1, label: "1 sao" },
  ];

  const handleToggleComment = (reviewId: string) => {
    setOpenCommentId((prev) => (prev === reviewId ? null : reviewId));
  };

  const handlePrefetchComments = (reviewId: string) => {
    queryClient.prefetchQuery({
      queryKey: reviewCommentsQueryKey({
        reviewId,
        page: COMMENTS_PAGE,
        limit: COMMENTS_PAGE_LIMIT,
      }),
      queryFn: () =>
        fetchComments({
          slug,
          reviewId,
          page: COMMENTS_PAGE,
          limit: COMMENTS_PAGE_LIMIT,
        }),
      staleTime: COMMENTS_PREFETCH_STALE_TIME,
    });
  };

  const handleConfirmDeleteReview = () => {
    if (!reviewToDelete) return;
    deleteReview.mutate(reviewToDelete, {
      onSuccess: () => setReviewToDelete(null),
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold">Khách hàng đánh giá</h2>

      <div className="sm:max-w-md">
        <p className="text-sm font-medium text-muted-foreground">Tổng quan</p>

        <div className="mt-3 flex items-center gap-4">
          <div className="shrink-0">
            <p className="text-4xl font-bold leading-none text-secondary">
              {summary.average.toFixed(1)}
            </p>
            <div className="mt-2">
              <Stars value={Math.round(summary.average)} size={16} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ({summary.total} đánh giá)
            </p>
          </div>

          <Separator orientation="vertical" className="h-16" />

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                summary.breakdown[
                  String(star) as "1" | "2" | "3" | "4" | "5"
                ] ?? 0;
              const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="flex w-8 shrink-0 items-center gap-0.5 text-muted-foreground">
                    {star}
                    <Star className="size-3 fill-secondary text-secondary" />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-4 shrink-0 text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Lọc theo
        </p>
        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <Button
              key={String(chip.key)}
              type="button"
              size="lg"
              variant={filter === chip.key ? "secondary" : "outline"}
              onClick={() => setFilter(chip.key)}
              className={cn(
                "rounded-full",
                filter === chip.key &&
                  "border-secondary bg-secondary/10 text-secondary hover:bg-secondary/15",
              )}
            >
              {chip.label}
            </Button>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Không có đánh giá phù hợp với bộ lọc này.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {filteredReviews.map((review) => {
            const isOwnReview =
              !!currentUser && currentUser.id === review.author.id;
            const showHelpful = !!currentUser && !isAdmin && !isOwnReview;
            const canDeleteReview = isOwnReview || isAdmin;
            const isThreadOpen = openCommentId === review.id;
            const hasPreviewComments =
              !!review.comments && review.comments.length > 0;

            return (
              <li key={review.id} className="flex gap-4 py-5 first:pt-0">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={review.author.avatarUrl ?? undefined}
                    alt={review.author.name}
                  />
                  <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
                    {initials(review.author.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold">
                          {review.author.name}
                        </p>
                        {isOwnReview && (
                          <Badge
                            variant="outline"
                            className="h-5 gap-1 border-secondary/30 bg-secondary/10 text-[11px] font-normal text-secondary"
                          >
                            <UserRound className="size-3" />
                            Đánh giá của bạn
                          </Badge>
                        )}
                      </div>
                      {review.author.email ? (
                        <p className="text-xs text-muted-foreground">
                          {review.author.email}
                        </p>
                      ) : null}
                      {review.author.memberSinceYears > 0 ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Đã tham gia {review.author.memberSinceYears} năm
                        </p>
                      ) : null}
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquareText className="size-3.5" />
                        Đã viết {review.author.reviewCount} đánh giá
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Heart className="size-3.5" />
                        Đã nhận {review.author.thanksCount} lượt cảm ơn
                      </p>
                    </div>

                    <div className="flex items-start gap-1">
                      <div className="text-right sm:text-right">
                        <div className="flex justify-end">
                          <Stars value={review.rating} />
                        </div>
                        <p className="mt-1 text-sm font-medium">
                          {RATING_LABELS[review.rating]}
                        </p>
                        {review.verifiedPurchase ? (
                          <Badge
                            variant="outline"
                            className="mt-1.5 gap-1 border-secondary/30 bg-secondary/10 text-secondary"
                          >
                            <CheckCircle2 className="size-3.5" />
                            Đã mua hàng
                          </Badge>
                        ) : null}
                      </div>

                      {canDeleteReview ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="px-2 text-muted-foreground hover:bg-transparent hover:text-secondary"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setReviewToDelete(review.id)}
                            >
                              <Trash2 className="size-4" />
                              Xóa đánh giá
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  </div>

                  {review.variantInfo && review.variantInfo.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {review.variantInfo.map((v, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          {v.colorHex && (
                            <span
                              className="size-3 shrink-0 rounded-full border"
                              style={{ backgroundColor: v.colorHex }}
                            />
                          )}
                          {displayVariantLabel(v.label)}: {v.value}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-1 text-sm text-muted-foreground">
                    Đánh giá vào {review.createdAtLabel}
                    {review.usedForLabel ? ` · ${review.usedForLabel}` : ""}
                  </p>

                  {review.content ? (
                    <p className="mt-3 text-sm leading-relaxed">
                      {review.content}
                    </p>
                  ) : null}

                  {review.images && review.images.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.images.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="size-16 rounded-md object-cover"
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    {showHelpful ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={helpfulPendingId === review.id}
                        onClick={() => onToggleHelpful?.(review.id)}
                        className={cn(
                          "gap-1.5 px-2 text-muted-foreground hover:bg-transparent hover:text-secondary",
                          review.isHelpfulByCurrentUser &&
                            "bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary",
                        )}
                      >
                        <ThumbsUp className="size-4" />
                        {review.isHelpfulByCurrentUser
                          ? "Bạn đã thích"
                          : "Hữu ích"}{" "}
                        {review.helpfulCount > 0
                          ? `(${review.helpfulCount})`
                          : ""}
                      </Button>
                    ) : null}

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onMouseEnter={() => handlePrefetchComments(review.id)}
                      onTouchStart={() => handlePrefetchComments(review.id)}
                      onClick={() => handleToggleComment(review.id)}
                      className={cn(
                        "gap-1.5 px-2 text-muted-foreground hover:bg-transparent hover:text-secondary",
                        isThreadOpen &&
                          "bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary",
                      )}
                    >
                      <MessageCircle className="size-4" />
                      Bình luận{" "}
                      {review.commentCount > 0
                        ? `(${review.commentCount})`
                        : ""}
                    </Button>
                  </div>

                  {hasPreviewComments && !isThreadOpen ? (
                    <CommentPreviewList
                      comments={review.comments!}
                      totalCount={review.commentCount}
                      onViewAll={() => handleToggleComment(review.id)}
                    />
                  ) : null}

                  {isThreadOpen ? (
                    <ReviewCommentThread
                      slug={slug}
                      reviewId={review.id}
                      currentUserId={currentUser?.id}
                      canModerate={isAdmin}
                      canComment={!!currentUser}
                      onClose={() => setOpenCommentId(null)}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Đang tải..." : "Xem thêm đánh giá"}
          </Button>
        </div>
      ) : null}

      <ConfirmActionDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
        icon={<Trash2 className="size-5" />}
        title="Xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        pendingLabel="Đang xóa..."
        isPending={deleteReview.isPending}
        onConfirm={handleConfirmDeleteReview}
        variant="destructive"
      />
    </div>
  );
}
