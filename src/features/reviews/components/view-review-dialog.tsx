"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Users,
  Heart,
  Calendar,
  ChevronRight,
  MessageSquareText,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { type Review } from "@/types/review";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ViewReviewDialogProps {
  review: Review | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ViewReviewDialog({
  review,
  onOpenChange,
}: ViewReviewDialogProps) {
  const wasEdited =
    review && review.updatedAt && review.updatedAt !== review.createdAt;

  return (
    <Dialog open={!!review} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-lg gap-5">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
          <DialogDescription>
            Thông tin đầy đủ về đánh giá của khách hàng.
          </DialogDescription>
        </DialogHeader>

        {review && (
          <div className="flex flex-col gap-4">
            {/* Author + rating */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                  {review.author.avatarUrl ? (
                    <Image
                      fill
                      src={review.author.avatarUrl}
                      sizes="40px"
                      className="object-cover"
                      alt={review.author.name}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                      {review.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium leading-none">
                      {review.author.name}
                    </span>
                    {review.verifiedPurchase && (
                      <Badge
                        variant="outline"
                        className="h-5 text-[11px] font-normal text-emerald-600"
                      >
                        Đã mua hàng
                      </Badge>
                    )}
                    {!review.author.isRegisteredUser && (
                      <Badge
                        variant="outline"
                        className="h-5 gap-1 text-[11px] font-normal text-muted-foreground"
                      >
                        <Users className="size-3" />
                        Khách
                      </Badge>
                    )}
                  </div>

                  {review.author.email && (
                    <span className="text-xs text-muted-foreground">
                      {review.author.email}
                    </span>
                  )}

                  {/* Trust strip — only meaningful for registered users */}
                  {review.author.isRegisteredUser && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {review.author.memberSinceYears > 0
                          ? `Thành viên ${review.author.memberSinceYears} năm`
                          : "Thành viên mới"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquareText className="size-3.5" />
                        {review.author.reviewCount} đánh giá
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="size-3.5" />
                        {review.author.thanksCount} lượt cảm ơn
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-current text-amber-500" />
                  <span className="text-sm font-semibold">
                    {review.rating}.0
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(review.createdAt)}
                  {wasEdited && " (đã sửa)"}
                </span>
              </div>
            </div>

            {/* Variant / used-for tags */}
            {((review.variantInfo && review.variantInfo.length > 0) ||
              review.usedForLabel) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {review.variantInfo?.map((v, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="flex items-center gap-1.5 font-normal text-muted-foreground"
                  >
                    {v.colorHex && (
                      <span
                        className="size-3 shrink-0 rounded-full border"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    {v.label}: {v.value}
                  </Badge>
                ))}
                {review.usedForLabel && (
                  <Badge
                    variant="outline"
                    className="font-normal text-muted-foreground"
                  >
                    Dùng cho: {review.usedForLabel}
                  </Badge>
                )}
              </div>
            )}

            {/* Content */}
            <p className="whitespace-pre-line rounded-md border bg-muted/40 px-3 py-2 text-[15px] leading-relaxed">
              {review.content}
            </p>

            {/* Images */}
            {review.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.images.map((url, i) => (
                  <div
                    key={i}
                    className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted"
                  >
                    <Image
                      fill
                      src={url}
                      sizes="80px"
                      className="object-cover"
                      alt={`Ảnh đánh giá ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="size-3.5" />
                {review.helpfulCount} lượt hữu ích
              </span>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/products/${review.product.slug}`}
                className="group flex items-center gap-2 rounded-md border bg-muted/30 py-1 pl-1 pr-2 transition-colors hover:bg-muted/60"
              >
                <div className="relative size-7 shrink-0 overflow-hidden rounded border bg-muted">
                  {review.product.thumbnailUrl && (
                    <Image
                      fill
                      src={review.product.thumbnailUrl}
                      sizes="28px"
                      className="object-cover"
                      alt={review.product.name}
                    />
                  )}
                </div>
                <span className="max-w-40 truncate text-xs font-medium">
                  {review.product.name}
                </span>
                <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
