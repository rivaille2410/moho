import Link from "next/link";

import { PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="wrapper flex flex-col items-center justify-center py-28 2xl:py-60 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <PackageX className="size-9 text-muted-foreground" />
      </div>

      <h1 className="mt-6 text-xl font-semibold">Không tìm thấy sản phẩm</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không còn tồn tại.
        Hãy thử tìm sản phẩm khác nhé.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button size={"lg"} variant="secondary">
          <Link href="/products">Xem tất cả sản phẩm</Link>
        </Button>
        <Button size={"lg"} variant="outline">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
