import type { Metadata } from "next";
import { headers } from "next/headers";

import { getPublicPostBySlug } from "@/features/posts/api/get-public-post-by-slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie") ?? undefined;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const post = await getPublicPostBySlug(slug, { baseUrl, cookie });
    const description = post.excerpt ?? `Đọc bài viết ${post.title} tại MOHO.`;

    return {
      title: `${post.title} | MOHO`,
      description,
      openGraph: {
        title: post.title,
        description,
        images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "Bài viết | MOHO",
      description: "Tin tức và câu chuyện từ MOHO.",
    };
  }
}

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
