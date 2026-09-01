"use client";

import { PostGrid } from "./post-grid";

import {
  usePublicPostsInfinite,
  type QueryPublicPostsParams,
} from "@/features/posts/hooks/use-public-posts";

interface PostListProps {
  title?: string;
  seeMoreHref?: string;
  params?: Omit<QueryPublicPostsParams, "page">;
}

export default function PostList({
  title = "Bài viết",
  seeMoreHref,
  params = { limit: 12 },
}: PostListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicPostsInfinite(params);

  if (isError) return null;

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="wrapper pb-12">
      <PostGrid
        title={title}
        posts={posts}
        isLoading={isLoading}
        hasMore={hasNextPage}
        seeMoreHref={seeMoreHref}
        onLoadMore={() => fetchNextPage()}
        isLoadingMore={isFetchingNextPage}
      />
    </div>
  );
}
