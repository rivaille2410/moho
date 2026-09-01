import type { Metadata } from "next";
import { headers } from "next/headers";

import { getPost } from "@/features/posts/api/get-post";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie") ?? undefined;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const post = await getPost(id, { baseUrl, cookie });

    return {
      title: `${post.title} | MOHO Admin`,
      description: `Chi tiết và nội dung bài viết ${post.title}.`,
    };
  } catch {
    return {
      title: "Chi tiết bài viết | MOHO Admin",
      description: "Xem và chỉnh sửa thông tin chi tiết bài viết.",
    };
  }
}

export default async function PostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
