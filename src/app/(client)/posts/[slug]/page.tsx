import PostDetailClient from "./post-detail-client";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PostDetailClient slug={slug} initialPost={null} />;
}
