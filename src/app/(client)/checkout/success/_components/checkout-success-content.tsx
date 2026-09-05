"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { CheckCircle2, Copy, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cart";

import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("ref");
  const [copied, setCopied] = useState(false);

  const clearCart = useCartStore((state) => state.clear);

  useEffect(() => {
    clearCart();
  }, []);

  const handleCopy = async () => {
    if (!orderRef) return;
    try {
      await navigator.clipboard.writeText(orderRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-12 space-y-3">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán" },
        ]}
      />

      <div className="wrapper">
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center 2xl:py-40">
          <CheckCircle2 className="size-16 text-green-600" strokeWidth={1.5} />

          <h1 className="text-2xl font-semibold">Đặt hàng thành công!</h1>

          <p className="max-w-md text-sm text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác
            nhận đơn hàng.
          </p>

          {orderRef ? (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2">
              <span className="text-sm text-muted-foreground">
                Mã đơn hàng:
              </span>
              <span className="text-sm font-semibold">{orderRef}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Sao chép mã đơn hàng"
              >
                <Copy className="size-3.5" />
              </button>
              {copied ? (
                <span className="text-xs text-green-600">Đã sao chép</span>
              ) : null}
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <Link href="/products">
              <Button size="xl" className="gap-2">
                <ShoppingBag className="size-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/">
              <Button size="xl" variant="outline">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
