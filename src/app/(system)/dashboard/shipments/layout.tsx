import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý vận đơn | MOHO Admin",
  description:
    "Quản lý, tìm kiếm, lọc và cập nhật trạng thái vận đơn trong hệ thống Moho.",
};

export default function ShipmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
