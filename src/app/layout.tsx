import "./globals.css";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import NextTopLoader from "nextjs-toploader";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toast";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartSyncProvider } from "@/components/providers/cart-sync-provider";

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Nội Thất MOHO: An Toàn Sức Khỏe - Bảo Hành 5 Năm",
  description:
    "MOHO mang lại những sản phẩm Nội Thất An Toàn cho Sức Khỏe, Bền Vững, Bảo Hành đến 5 Năm. Trọn bộ nội thất Phòng Khách - Phòng Ngủ - Phòng Ăn và Tủ Bếp. LH: 0971 141 140",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={cn("h-full", "antialiased", lexend.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <CartSyncProvider>
            <Toaster />
            <ScrollProgress />
            <NextTopLoader
              crawl
              height={3}
              speed={200}
              easing="ease"
              crawlSpeed={200}
              showSpinner={false}
              initialPosition={0.08}
              color="var(--secondary)"
            />
            {children}
          </CartSyncProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
