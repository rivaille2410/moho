import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng | MOHO Admin",
  description: "Xem, lọc và cập nhật trạng thái đơn hàng trong hệ thống Moho.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
