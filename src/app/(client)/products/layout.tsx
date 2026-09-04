import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm | MOHO",
  description: "Khám phá bộ sưu tập sản phẩm nội thất tại Moho.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
