import type { Metadata } from "next";

import { getPublicPostBySlug } from "@/features/posts/api/get-public-post-by-slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublicPostBySlug(slug, {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
      revalidateSeconds: 300,
    });
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
