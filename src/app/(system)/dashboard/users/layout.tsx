import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng | MOHO Admin",
  description:
    "Quản lý, tìm kiếm, lọc và phân quyền người dùng trong hệ thống Moho.",
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
