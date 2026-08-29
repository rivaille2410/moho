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

export function WriteReviewDialog({
  target,
  onOpenChange,
}: WriteReviewDialogProps) {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [content, setContent] = React.useState("");

  const { mutate, isPending } = useCreateCustomerReview();

  const open = !!target;

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        </DialogHeader>

        {target && (
          <div className="flex flex-col gap-4">
            <p className="line-clamp-2 text-sm font-medium">
              {target.productName}
            </p>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5"
                >
                  <Star
                    className={cn(
                      "size-6 transition",
                      (hoverRating || rating) >= star
                        ? "fill-secondary text-secondary"
                        : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              rows={4}
            />
          </div>
        )}

        <DialogFooter>
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
