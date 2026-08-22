"use client";

import { useMemo, useState } from "react";

import {
  Star,
  Share2,
  ThumbsUp,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ProductReviewAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
  memberSinceYears: number;
  reviewCount: number;
  thanksCount: number;
}

export interface ProductReview {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: ProductReviewAuthor;
  verifiedPurchase: boolean;
  variantInfo?: { label: string; value: string }[];
  createdAtLabel: string;
  usedForLabel?: string;
  helpfulCount: number;
  commentCount: number;
  content?: string;
  images?: string[];
}

export interface ProductReviewSummary {
  average: number;
  total: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

interface ProductReviewsProps {
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
              ? "fill-amber-400 text-amber-400"
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

export default function ProductReviews({
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

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold">Khách hàng đánh giá</h2>

      <div>
        <p className="text-sm font-medium text-muted-foreground">Tổng quan</p>

        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <p className="text-4xl font-bold leading-none">
              {summary.average.toFixed(1)}
            </p>
            <div className="mt-2">
              <Stars value={Math.round(summary.average)} size={18} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              ({summary.total} đánh giá)
            </p>
          </div>

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                summary.breakdown[
                  String(star) as "1" | "2" | "3" | "4" | "5"
                ] ?? 0;
              const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="flex w-10 shrink-0 items-center gap-1 text-muted-foreground">
                    {star}
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-600"
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
              size="sm"
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

      <Separator />

      {filteredReviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Không có đánh giá phù hợp với bộ lọc này.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {filteredReviews.map((review) => (
            <li key={review.id} className="flex gap-4 py-5 first:pt-0">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={review.author.avatarUrl ?? undefined}
                  alt={review.author.name}
                />
                <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                  {initials(review.author.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {review.author.name}
                    </p>
                    {review.author.memberSinceYears > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Đã tham gia {review.author.memberSinceYears} năm
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Đã viết {review.author.reviewCount} đánh giá
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đã nhận {review.author.thanksCount} lượt cảm ơn
                    </p>
                  </div>

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
                        className="mt-1.5 gap-1 border-emerald-200 bg-emerald-50 text-emerald-600"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Đã mua hàng
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {review.variantInfo && review.variantInfo.length > 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {review.variantInfo.map((v, i) => (
                      <span key={v.label}>
                        {i > 0 ? ", " : ""}
                        {v.label}: {v.value}
                      </span>
                    ))}
                  </p>
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
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={helpfulPendingId === review.id}
                    onClick={() => onToggleHelpful?.(review.id)}
                    className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="size-4" />
                    Hữu ích{" "}
                    {review.helpfulCount > 0 ? `(${review.helpfulCount})` : ""}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircle className="size-4" />
                    Bình luận
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="ml-auto gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="size-4" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            </li>
          ))}
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
    </div>
  );
}
