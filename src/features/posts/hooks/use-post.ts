import { useQuery } from "@tanstack/react-query";

import { getPost } from "@/features/posts/api/get-post";

export const usePost = (id: string | undefined) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
  });
};
