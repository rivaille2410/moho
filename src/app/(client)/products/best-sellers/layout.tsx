import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm bán chạy | MOHO",
  description: "Khám phá những sản phẩm nội thất bán chạy nhất tại Moho.",
};

export default function BestSellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
