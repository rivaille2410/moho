"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PublicApiErrorStateProps {
  onRetry: () => void;
  isRetrying?: boolean;
  compact?: boolean;
  className?: string;
}

export function PublicApiErrorState({
  onRetry,
  isRetrying = false,
  compact = false,
  className,
}: PublicApiErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-center",
        compact ? "py-6" : "py-16",
        className,
      )}
    >
      <AlertCircle className="size-5 text-muted-foreground" />
      <p className="font-medium">Không thể kết nối đến máy chủ</p>
      <p className="text-sm text-muted-foreground">
        Máy chủ có thể đang khởi động hoặc gặp lỗi tạm thời. Hãy thử lại sau ít giây.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Đang thử lại..." : "Thử lại"}
      </Button>
    </div>
  );
}
