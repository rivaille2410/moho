"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Newspaper } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { PostCard, PostCardSkeleton } from "./post-card";

import { useGridColumns } from "@/hooks/use-grid-columns";
import { PostListItem } from "@/types/post";

interface PostGridProps {
  title?: string;
  hasMore?: boolean;
  isLoading: boolean;
  seeMoreHref?: string;
  posts: PostListItem[];
  isLoadingMore?: boolean;
  skeletonCount?: number;
  onLoadMore?: () => void;
}

// basis phải khớp với useGridColumns: 2 / 3 / 4 / 5 / 6
const ITEM_CLASS =
  "pl-3 sm:pl-5 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6";

// Tải thêm khi cuộn qua ngưỡng này (0 -> 1)
const LOAD_MORE_THRESHOLD = 0.75;

export function PostGrid({
  posts,
  hasMore,
  isLoading,
  seeMoreHref,
  onLoadMore,
  skeletonCount,
  isLoadingMore,
  title = "Bài viết",
}: PostGridProps) {
  const columns = useGridColumns();
  const [api, setApi] = useState<CarouselApi>();

  const isEmpty = !isLoading && posts.length === 0;

  // Khi còn dữ liệu: chỉ hiển thị số bài là bội số của số cột (không bị lẻ).
  // Khi đã tải hết: hiển thị tất cả, nhóm cuối được phép lẻ.
  const visiblePosts = hasMore
    ? posts.slice(0, Math.floor(posts.length / columns) * columns)
    : posts;

  const initialSkeletons = skeletonCount ?? columns;

  // Luôn giữ callback mới nhất mà không làm effect chạy lại
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!api || !hasMore || isLoadingMore) return;

    const check = () => {
      if (api.scrollProgress() >= LOAD_MORE_THRESHOLD || !api.canScrollNext()) {
        onLoadMoreRef.current?.();
      }
    };

    api.on("scroll", check);
    api.on("select", check);
    api.on("reInit", check);
    check();

    return () => {
      api.off("scroll", check);
      api.off("select", check);
      api.off("reInit", check);
    };
  }, [api, hasMore, isLoadingMore, visiblePosts.length]);

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
        <Carousel
          setApi={setApi}
          opts={{ align: "start", dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-5">
            {isLoading
              ? Array.from({ length: initialSkeletons }).map((_, i) => (
                  <CarouselItem key={i} className={ITEM_CLASS}>
                    <PostCardSkeleton />
                  </CarouselItem>
                ))
              : visiblePosts.map((post) => (
                  <CarouselItem key={post.id} className={ITEM_CLASS}>
                    <PostCard post={post} />
                  </CarouselItem>
                ))}

            {isLoadingMore &&
              Array.from({ length: columns }).map((_, i) => (
                <CarouselItem key={`more-${i}`} className={ITEM_CLASS}>
                  <PostCardSkeleton />
                </CarouselItem>
              ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 hidden sm:inline-flex" />
          <CarouselNext className="right-2 hidden sm:inline-flex" />
        </Carousel>
      )}
    </section>
  );
}
