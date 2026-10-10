import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../api/posts-api";
import { queryKeys } from "@/lib/query-keys";
import { PostsResponse, QueryPostsParams } from "@/types/post";

export const usePosts = (params: QueryPostsParams = {}) => {
  return useQuery<PostsResponse>({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => postsApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
};
