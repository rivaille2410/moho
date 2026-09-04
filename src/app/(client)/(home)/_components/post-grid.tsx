"use client";

import Link from "next/link";

import { ChevronDown, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { PostCard, PostCardSkeleton } from "./post-card";

import { PostListItem } from "@/types/post";
import { useGridColumns } from "@/hooks/use-grid-columns";

interface PostGridProps {
  title?: string;
  hasMore?: boolean;
  isLoading: boolean;
  seeMoreHref?: string;
  skeletonCount?: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  posts: PostListItem[];
}

export function PostGrid({
  posts,
  hasMore,
  isLoading,
  onLoadMore,
  seeMoreHref,
  isLoadingMore,
  title = "Bài viết",
  skeletonCount = 12,
}: PostGridProps) {
  const columns = useGridColumns();

  const visibleCount =
    posts.length < columns
      ? posts.length
      : Math.floor(posts.length / columns) * columns;

  const visiblePosts = posts.slice(0, visibleCount);

  const hasHiddenRemainder = visibleCount < posts.length;
  const isEmpty = !isLoading && posts.length === 0;

  return (
    <section className="py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-[22px]">
          {title}
        </h2>
        {seeMoreHref && !isEmpty && (
          <Link
            href={seeMoreHref}
            className="text-[13px] sm:text-sm font-medium text-secondary hover:underline"
          >
            Xem tất cả
          </Link>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Newspaper className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Chưa có bài viết nào
            </p>
            <p className="text-sm text-muted-foreground">
              Hãy quay lại sau nhé.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
        </div>
      )}

      {!isLoading && onLoadMore && (hasMore || hasHiddenRemainder) && (
        <div className="mt-8 flex justify-center">
          <Button
            size={"lg"}
            variant="ghost"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-secondary hover:text-secondary"
          >
            {isLoadingMore ? (
              <>
                <Spinner className="size-4" />
                Đang tải...
              </>
            ) : (
              <>
                Xem thêm
                <ChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
