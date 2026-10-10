"use client";

import { useCallback, useMemo } from "react";

import { PostGrid } from "./post-grid";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";

import { useGridColumns } from "@/hooks/use-grid-columns";
import {
  usePublicPostsInfinite,
  type QueryPublicPostsParams,
} from "@/features/posts/hooks/use-public-posts";
import type { PostsResponse } from "@/types/post";

interface PostListProps {
  title?: string;
  seeMoreHref?: string;
  params?: Omit<QueryPublicPostsParams, "page">;
  initialPage?: PostsResponse;
}

const DEFAULT_LIMIT = 18;

export default function PostList({
  title = "Bài viết",
  seeMoreHref,
  params,
  initialPage,
}: PostListProps) {
  const columns = useGridColumns();

  // Mỗi lần tải = bội số của số cột (làm tròn lên) để luôn đủ hàng
  const queryParams = useMemo(() => {
    const cols = Math.max(1, columns);
    const target = params?.limit ?? DEFAULT_LIMIT;
    return { ...params, limit: cols * Math.ceil(target / cols) };
  }, [params, columns]);

  const {
    data,
    isLoading,
    isLoadingError,
    isFetchNextPageError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePublicPostsInfinite(queryParams, initialPage);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  if (isLoadingError) {
    return (
      <div className="wrapper">
        <PublicApiErrorState
          compact
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="wrapper pb-12">
      <PostGrid
        title={title}
        posts={posts}
        isLoading={isLoading}
        hasMore={hasNextPage}
        seeMoreHref={seeMoreHref}
        onLoadMore={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />
      {isFetchNextPageError && (
        <PublicApiErrorState
          compact
          onRetry={() => void fetchNextPage()}
          isRetrying={isFetchingNextPage}
        />
      )}
    </div>
  );
}
