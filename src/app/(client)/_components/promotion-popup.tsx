"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PROMOTION_IMAGE = "/promotion/plank-chair-promotion.webp";
const LAST_SHOWN_KEY = "moho-promotion-last-shown";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 8_000;

export function PromotionPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let image: HTMLImageElement | undefined;
    let cancelled = false;

    try {
      const lastShownAt = Number(localStorage.getItem(LAST_SHOWN_KEY));
      if (lastShownAt && Date.now() - lastShownAt < COOLDOWN_MS) return;
    } catch {
      // Storage can be unavailable in private browsing; the popup still works.
    }

    timer = setTimeout(() => {
      image = new window.Image();
      image.onload = () => {
        if (cancelled) return;
        try {
          localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
        } catch {
          // Keep showing the promotion even when storage is unavailable.
        }
        setOpen(true);
      };
      image.onerror = () => setOpen(false);
      image.src = PROMOTION_IMAGE;
    }, SHOW_DELAY_MS);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="block w-[min(88vw,60vh,44rem)] max-w-none overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none outline-none ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Ưu đãi ghế ăn PLANK</DialogTitle>
        <Link
          href="/products"
          aria-label="Xem sản phẩm đang khuyến mãi"
          onClick={() => setOpen(false)}
          className="relative block aspect-square overflow-hidden rounded-2xl"
        >
          <Image
            src={PROMOTION_IMAGE}
            alt="Ưu đãi ghế ăn PLANK"
            fill
            priority
            sizes="(max-width: 768px) 88vw, min(60vh, 704px)"
            className="object-cover"
          />
        </Link>
        <button
          type="button"
          aria-label="Đóng khuyến mãi"
          onClick={() => setOpen(false)}
          className="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-black/80"
        >
          <X className="size-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
