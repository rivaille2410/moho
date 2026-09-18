"use client";

import * as React from "react";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { useCreateCustomerReview } from "@/features/reviews/hooks/use-create-customer-review";

type WriteReviewDialogProps = {
  target: {
    slug: string;
    productName: string;
    variantId?: string;
  } | null;
  onOpenChange: (open: boolean) => void;
};

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Không hài lòng",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Tuyệt vời!",
};

const MAX_CONTENT_LENGTH = 500;

export function WriteReviewDialog({
  target,
  onOpenChange,
}: WriteReviewDialogProps) {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [content, setContent] = React.useState("");

  const { mutate, isPending } = useCreateCustomerReview();

  const open = !!target;
  const displayRating = hoverRating || rating;

  React.useEffect(() => {
    if (open) {
      setRating(0);
      setHoverRating(0);
      setContent("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!target || rating === 0) return;

    mutate(
      {
        slug: target.slug,
        rating,
        content,
        variantId: target.variantId,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        <div className="bg-linear-to-b from-secondary/10 to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Đánh giá sản phẩm</DialogTitle>
            {target && (
              <DialogDescription className="line-clamp-2 pt-1 font-medium text-foreground">
                {target.productName}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        {target && (
          <div className="flex flex-col gap-6 px-6 pb-2">
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform duration-150 ease-out hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={cn(
                        "size-9 transition-all duration-150",
                        displayRating >= star
                          ? "fill-secondary text-secondary drop-shadow-sm"
                          : "text-muted-foreground/30",
                      )}
                    />
                  </button>
                ))}
              </div>

              <p
                className={cn(
                  "h-5 text-sm font-semibold transition-opacity duration-150",
                  displayRating > 0
                    ? "opacity-100 text-secondary"
                    : "opacity-0",
                )}
              >
                {RATING_LABELS[displayRating] ?? ""}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
                }
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                rows={4}
                className="resize-none"
              />
              <span className="self-end text-xs text-muted-foreground">
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="bg-muted/30 px-9 pb-9">
          <Button
            size={"lg"}
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            size={"lg"}
            onClick={handleSubmit}
            disabled={rating === 0 || isPending}
          >
            {isPending && <Spinner className="size-4" />}
            {isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
