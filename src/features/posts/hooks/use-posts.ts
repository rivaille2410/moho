import { useQuery } from "@tanstack/react-query";

import { PostsResponse, QueryPostsParams } from "@/types/post";

async function fetchPosts(params: QueryPostsParams): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const res = await fetch(`/api/posts${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export const usePosts = (params: QueryPostsParams = {}) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
    staleTime: 5 * 60 * 1000,
  });
};
