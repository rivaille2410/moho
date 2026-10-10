"use client";

import { useRef } from "react";

import DOMPurify from "dompurify";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { PostGrid } from "../../(home)/_components/post-grid";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

import { usePostToc } from "@/features/posts/hooks/use-post-toc";
import { usePublicPost } from "@/features/posts/hooks/use-public-post";
import { usePublicPostsInfinite } from "@/features/posts/hooks/use-public-posts";
import { PostTableOfContents } from "@/features/posts/components/post-detail/post-table-of-contents";
import type { Post } from "@/types/post";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";
import { ApiError } from "@/lib/api-error";

interface PostPageProps {
  slug: string;
  initialPost: Post | null;
}

export default function PostPage({ slug, initialPost }: PostPageProps) {
  const {
    data: post,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = usePublicPost(slug, initialPost);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    data: relatedData,
    isLoading: isLoadingRelated,
    hasNextPage: hasMoreRelated,
    fetchNextPage: fetchNextRelated,
    isFetchingNextPage: isFetchingMoreRelated,
  } = usePublicPostsInfinite({ limit: 12 });

  const relatedPosts = (
    relatedData?.pages.flatMap((page) => page.data) ?? []
  ).filter((p) => p.slug !== slug);

  const sanitizedContent = post ? DOMPurify.sanitize(post.content) : "";
  const { toc, activeId } = usePostToc(contentRef, [sanitizedContent]);

  const hasToc = toc.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-3 pb-12">
        <div className="wrapper">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-3" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-3" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="wrapper">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[350px_1fr] pt-6 pb-12">
            <div className="hidden lg:block">
              <Skeleton className="mb-3 h-6 w-24" />
              <div className="space-y-2 border-l pl-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="ml-3 h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="aspect-video w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          <PublicApiLoadingHint className="lg:col-start-2" />

          <div className="space-y-4">
            <Skeleton className="h-7 w-36" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post && isError && error instanceof ApiError && error.isNotFound) {
    return (
      <div className="wrapper flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy bài viết</p>
        <p className="text-sm text-muted-foreground">
          Bài viết có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  if (!post && isError) {
    return (
      <div className="wrapper">
        <PublicApiErrorState
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="space-y-3 pb-12">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Bài viết", href: "/posts" },
          { label: post.title },
        ]}
      />

      <div className="wrapper">
        <div
          className={cn(
            "grid grid-cols-1 gap-10 pt-6 pb-12",
            hasToc && "lg:grid-cols-[350px_1fr]",
          )}
        >
          {hasToc && <PostTableOfContents toc={toc} activeId={activeId} />}

          <div
            ref={contentRef}
            className="prose prose-sm max-w-none prose-img:mx-auto prose-img:block prose-img:rounded-lg md:prose-base"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {(isLoadingRelated || relatedPosts.length > 0) && (
          <PostGrid
            skeletonCount={6}
            title="Bài viết khác"
            hasMore={hasMoreRelated}
            posts={relatedPosts}
            isLoading={isLoadingRelated}
            onLoadMore={() => fetchNextRelated()}
            isLoadingMore={isFetchingMoreRelated}
          />
        )}
      </div>
    </div>
  );
}
