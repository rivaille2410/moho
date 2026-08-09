import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nội Thất MOHO: An Toàn Sức Khỏe - Bảo Hành 5 Năm",
  description:
    "MOHO mang lại những sản phẩm Nội Thất An Toàn cho Sức Khỏe, Bền Vững, Bảo Hành đến 5 Năm. Trọn bộ nội thất Phòng Khách - Phòng Ngủ - Phòng Ăn và Tủ Bếp. LH: 0971 141 140",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={cn("h-full", "antialiased", beVietnamPro.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
