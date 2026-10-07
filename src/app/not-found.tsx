import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - Không tìm thấy trang | MOHO",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div
        aria-hidden
        className="nf-glow absolute top-0 left-1/2 -z-10 h-130 w-130 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl"
      />

      <div
        aria-hidden
        className="nf-swing flex origin-top flex-col items-center"
      >
        <div className="h-24 w-px bg-foreground/30 sm:h-32" />
        <svg width="96" height="64" viewBox="0 0 96 64" fill="none">
          <path
            d="M8 60C8 30 26 8 48 8s40 22 40 52H8Z"
            className="fill-primary"
          />
          <ellipse cx="48" cy="60" rx="40" ry="4" className="fill-primary/60" />
        </svg>
        <div className="nf-flicker -mt-1 h-3 w-10 rounded-full bg-amber-200 shadow-[0_0_40px_20px_rgba(253,230,138,0.55)]" />
      </div>

      <h1 className="relative -mt-2 flex items-center gap-1 text-[7rem] leading-none font-black tracking-tighter sm:text-[11rem]">
        <span className="text-foreground/90">4</span>
        <span className="nf-float relative bg-linear-to-b from-primary to-primary/40 bg-clip-text text-transparent">
          0
        </span>
        <span className="text-foreground/90">4</span>
      </h1>

      <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
        Không tìm thấy trang
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        Trang bạn đang tìm không tồn tại, đã bị xóa hoặc đường dẫn đã thay đổi.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg">
          <Link href="/">Về trang chủ</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/products">Xem sản phẩm</Link>
        </Button>
      </div>
    </div>
  );
}
