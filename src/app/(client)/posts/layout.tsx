import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bài viết | MOHO",
  description: "Khám phá các bài viết, chia sẻ và cập nhật mới nhất từ Moho.",
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
