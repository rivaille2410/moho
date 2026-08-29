import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | MOHO",
  description:
    "Xem lại lịch sử và trạng thái các đơn hàng bạn đã đặt tại MOHO.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
