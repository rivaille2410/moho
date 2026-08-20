import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm | MOHO Admin",
  description:
    "Quản lý, tìm kiếm, lọc và phân loại sản phẩm trong hệ thống Moho.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
