import { getPublicPostBySlug } from "@/features/posts/api/get-public-post-by-slug";
import type { Post } from "@/types/post";
import PostDetailClient from "./post-detail-client";

export const revalidate = 300;
export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    post = await getPublicPostBySlug(slug, {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
      revalidateSeconds: 300,
    });
  } catch {
    // Keep the client-side query as a fallback if the server request fails.
  }

  return <PostDetailClient slug={slug} initialPost={post} />;
}
