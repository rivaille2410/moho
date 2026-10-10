"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";
import { PostCard, PostCardSkeleton } from "../(home)/_components/post-card";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePublicPostsInfinite } from "@/features/posts/hooks/use-public-posts";
import type { PostsResponse } from "@/types/post";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Xem nhiều nhất" },
] as const;

export default function PostsPage({
  initialPage,
}: {
  initialPage?: PostsResponse;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("newest");

  const debouncedSearch = useDebouncedValue(search, 400);

  const params = useMemo(
    () => ({
      limit: 16,
      search: debouncedSearch || undefined,
      sortBy,
    }),
    [debouncedSearch, sortBy],
  );

  const {
    data,
    isLoading,
    isLoadingError,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = usePublicPostsInfinite(params, initialPage);

  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages[0]?.meta.totalItems;

  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    hasError: isFetchNextPageError,
    onLoadMore: () => fetchNextPage(),
  });

  return (
    <div className="space-y-3 pb-16">
      <PageBreadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Bài viết" }]}
      />

      <div className="wrapper">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Bài viết
            {typeof totalItems === "number" && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            )}
          </h1>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài viết..."
                className="w-full pl-8 sm:w-64"
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue>
                  {(value: string) =>
                    SORT_OPTIONS.find((opt) => opt.value === value)?.label ??
                    value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingError ? (
          <PublicApiErrorState
            onRetry={() => void refetch()}
            isRetrying={isFetching}
          />
        ) : !isLoading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-medium">Không tìm thấy bài viết</p>
            <p className="text-sm text-muted-foreground">
              Thử tìm kiếm với từ khoá khác.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))
                : posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>

            {isLoading && <PublicApiLoadingHint className="mt-4" />}

            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="mt-8 flex h-10 items-center justify-center"
              >
                {isFetchingNextPage && <Spinner className="size-5" />}
              </div>
            )}

            {isFetchNextPageError && (
              <PublicApiErrorState
                compact
                onRetry={() => void fetchNextPage()}
                isRetrying={isFetchingNextPage}
              />
            )}

            {!hasNextPage && !isLoading && posts.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Đã hiển thị tất cả bài viết
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
