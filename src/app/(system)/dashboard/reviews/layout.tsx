import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý đánh giá | MOHO Admin",
  description: "Xem, lọc và quản lý đánh giá sản phẩm trong hệ thống Moho.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
