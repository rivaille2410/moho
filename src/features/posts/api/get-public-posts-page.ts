import type { PostsResponse, QueryPostsParams } from "@/types/post";
import { fetchPublicApi } from "@/lib/public-api";

export async function getPublicPostsPage(
  params: QueryPostsParams,
): Promise<PostsResponse> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 16));
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  return fetchPublicApi<PostsResponse>(`/public/posts?${query}`, {
    revalidate: 300,
    tags: ["public-posts"],
  });
}
