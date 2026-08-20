import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý danh mục | MOHO Admin",
  description:
    "Quản lý, tìm kiếm và tổ chức cây danh mục sản phẩm trong hệ thống Moho.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
