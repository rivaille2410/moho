import PostsClient from "./posts-client";
import { getPublicPostsPage } from "@/features/posts/api/get-public-posts-page";
import type { PostsResponse } from "@/types/post";

export const revalidate = 300;

export default async function PostsPage() {
  let initialPage: PostsResponse | undefined;
  try {
    initialPage = await getPublicPostsPage({ page: 1, limit: 16, sortBy: "newest" });
  } catch {
    // The client query remains available if the public API is temporarily down.
  }

  return <PostsClient initialPage={initialPage} />;
}
