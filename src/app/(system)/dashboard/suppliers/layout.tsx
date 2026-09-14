import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nhà cung cấp | MOHO Admin",
  description: "Quản lý danh sách nhà cung cấp phục vụ nhập hàng.",
};

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
