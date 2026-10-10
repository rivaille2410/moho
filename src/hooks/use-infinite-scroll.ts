import { RefObject, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  rootRef?: RefObject<Element | null>;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  hasError,
  onLoadMore,
  rootMargin = "200px",
  rootRef,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || hasError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !hasError) {
          onLoadMore();
        }
      },
      { root: rootRef?.current ?? null, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasError, hasMore, isLoading, onLoadMore, rootMargin, rootRef]);

  return sentinelRef;
}
