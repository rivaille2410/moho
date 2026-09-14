import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn nhập hàng | MOHO Admin",
  description: "Quản lý đơn nhập hàng từ nhà cung cấp.",
};

export default function PurchaseOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
