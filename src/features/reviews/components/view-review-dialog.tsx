"use client";

import Link from "next/link";
import Image from "next/image";

import { Star, BadgeCheck } from "lucide-react";

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

interface ViewReviewDialogProps {
  review: Review | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewReviewDialog({
  review,
  onOpenChange,
}: ViewReviewDialogProps) {
  return (
    <Dialog open={!!review} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
          <DialogDescription>
            Thông tin đầy đủ về đánh giá của khách hàng.
          </DialogDescription>
        </DialogHeader>

        {review && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{review.author.name}</span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-normal",
                      review.author.isRegisteredUser
                        ? "border-secondary/20 bg-secondary/10 text-secondary"
                        : "border-muted-foreground/20 bg-muted text-muted-foreground",
                    )}
                  >
                    {review.author.isRegisteredUser ? "Thành viên" : "Khách"}
                  </Badge>
                  {review.verifiedPurchase && (
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
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/25",
                    )}
                  />
                ))}
              </div>
            </div>

            {review.variantInfo && review.variantInfo.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {review.variantInfo
                  .map((v) => `${v.label}: ${v.value}`)
                  .join(", ")}
              </p>
            )}

            <p className="whitespace-pre-line text-sm">{review.content}</p>

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

            <p className="text-xs text-muted-foreground">
              {review.helpfulCount} lượt hữu ích · Sản phẩm:{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/products/${review.product.slug}`}
                className="text-secondary hover:underline"
              >
                {review.product.name}
              </Link>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
