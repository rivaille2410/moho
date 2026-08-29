import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản của tôi | MOHO",
  description:
    "Quản lý thông tin cá nhân, địa chỉ giao hàng và lịch sử đơn hàng của bạn tại MOHO.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
