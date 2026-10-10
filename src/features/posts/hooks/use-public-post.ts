import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/types/post";
import { postsApi } from "@/features/posts/api/posts-api";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

export const usePublicPost = (slug: string | undefined, initialData?: Post | null) => {
  return useQuery({
    queryKey: ["public-posts", slug],
    queryFn: ({ signal }) => postsApi.publicDetail(slug as string, { signal }),
    enabled: !!slug,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
};
