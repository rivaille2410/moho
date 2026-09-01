import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý bài viết | MOHO Admin",
  description:
    "Quản lý, tìm kiếm, lọc và cập nhật bài viết trong hệ thống Moho.",
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
