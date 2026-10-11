"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function PublicApiLoadingHint({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 6_000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      Máy chủ đang khởi động. Trang sẽ tự tải khi kết nối lại.
    </p>
  );
}
