import { useQuery } from "@tanstack/react-query";

import { getPublicPostBySlug } from "@/features/posts/api/get-public-post-by-slug";

export const usePublicPost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["public-posts", slug],
    queryFn: () => getPublicPostBySlug(slug as string),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
