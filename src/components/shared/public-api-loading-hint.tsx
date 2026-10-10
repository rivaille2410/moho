"use client";

import { useEffect, useState } from "react";

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
      className={cn("text-center text-sm text-muted-foreground", className)}
    >
      Máy chủ đang khởi động. Vui lòng chờ thêm một chút.
    </p>
  );
}
