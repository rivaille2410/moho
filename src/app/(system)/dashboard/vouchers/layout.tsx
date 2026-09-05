import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý voucher | MOHO Admin",
  description:
    "Quản lý, tìm kiếm, lọc và cập nhật voucher giảm giá trong hệ thống Moho.",
};

export default function VouchersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
