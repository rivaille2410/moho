"use client";

import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { PackageOpen, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";

import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { usePublicProductsInfinite } from "@/features/products/hooks/use-public-products";

const DEBOUNCE_MS = 300;
const PREVIEW_LIMIT = 6;
const SKELETON_COUNT = 5;
const LOAD_MORE_SKELETON_COUNT = 2;
const SEARCH_PARAM = "search";

const buildSearchHref = (q: string) =>
  `/products?${SEARCH_PARAM}=${encodeURIComponent(q)}`;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

interface SearchInputProps {
  className?: string;
  onSearched?: () => void;
}

function SearchResultSkeletonItem() {
  return (
    <li className="flex items-center gap-3 rounded-md p-2">
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </li>
  );
}

function SearchResultSkeleton({ count = SKELETON_COUNT }: { count?: number }) {
  return (
    <ul className="p-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <SearchResultSkeletonItem key={i} />
      ))}
    </ul>
  );
}

function SearchForm({ className, onSearched }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get(SEARCH_PARAM) ?? "";

  const formRef = React.useRef<HTMLFormElement>(null);

  // Chỉ dùng currentQuery làm giá trị khởi tạo (vd: reload /products?search=abc).
  // Không đồng bộ lại sau đó, để clearInput() không bị ghi đè.
  const [value, setValue] = React.useState(currentQuery);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const trimmed = value.trim();
  const debounced = useDebouncedValue(trimmed, DEBOUNCE_MS);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    isError,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePublicProductsInfinite(
      { search: debounced, limit: PREVIEW_LIMIT },
      undefined,
      { enabled: debounced.length > 0 },
    );

  const products = data?.pages.flatMap((page) => page.data) ?? [];
  const isSearching =
    trimmed !== debounced || (isFetching && products.length === 0);
  const showPanel = open && trimmed.length > 0;
  const resultsScrollRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const loadMoreSentinelRef = useInfiniteScroll({
    hasMore: showPanel && Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    hasError: isFetchNextPageError,
    onLoadMore: loadMoreRef,
    rootMargin: "80px",
    rootRef: resultsScrollRef,
  });

  React.useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!formRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const clearInput = () => {
    setValue("");
    setActiveIndex(-1);
  };

  const goToSearchPage = (q: string) => {
    router.push(buildSearchHref(q));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trimmed) return;

    const activeProduct = activeIndex >= 0 ? products[activeIndex] : undefined;

    if (activeProduct) {
      router.push(`/products/${activeProduct.slug}`);
    } else {
      goToSearchPage(trimmed);
    }

    clearInput();
    closePanel();
    onSearched?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, products.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      closePanel();
    }
  };

  const handleProductClick = () => {
    clearInput();
    closePanel();
    onSearched?.();
  };

  const handleViewAllClick = () => {
    clearInput();
    closePanel();
    onSearched?.();
  };

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <Input
        name="q"
        value={value}
        autoComplete="off"
        enterKeyHint="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="search-suggestions"
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setValue(e.target.value);
          setActiveIndex(-1);
          setOpen(true);
        }}
        placeholder="Tìm kiếm sản phẩm..."
        className="h-10 w-full pr-20 lg:min-w-md 2xl:min-w-lg"
      />

      {value && (
        <button
          type="button"
          aria-label="Xoá từ khoá"
          onClick={clearInput}
          className="absolute right-12 top-5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}

      <Button
        type="submit"
        size="xl"
        aria-label="Tìm kiếm"
        disabled={!trimmed}
        className="absolute right-0 top-0 min-w-12 rounded-l-none"
      >
        <Search />
      </Button>

      {showPanel && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border bg-background shadow-lg"
        >
          {products.length === 0 && isSearching && <SearchResultSkeleton />}
          {products.length === 0 && isSearching && (
            <PublicApiLoadingHint className="px-4 pb-3" />
          )}

          {products.length === 0 && isError && (
            <PublicApiErrorState
              compact
              onRetry={() => void refetch()}
              isRetrying={isFetching}
            />
          )}

          {products.length === 0 && !isSearching && !isError && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <PackageOpen className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Không tìm thấy sản phẩm phù hợp
              </p>
            </div>
          )}

          {products.length > 0 && (
            <>
              <div
                ref={resultsScrollRef}
                className="max-h-96 overflow-y-auto overscroll-contain"
              >
                <ul className="p-1">
                  {products.map((product, index) => (
                    <li
                      key={product.id}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={handleProductClick}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "flex items-center gap-3 rounded-md p-2",
                          index === activeIndex && "bg-muted",
                        )}
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.images?.[0] && (
                            <Image
                              fill
                              sizes="48px"
                              src={product.images[0].url}
                              alt={product.name}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          {product.price !== undefined && (
                            <p className="text-sm text-secondary">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                {isFetchingNextPage && (
                  <SearchResultSkeleton count={LOAD_MORE_SKELETON_COUNT} />
                )}

                {hasNextPage && (
                  <div
                    ref={loadMoreSentinelRef}
                    className="h-px"
                    aria-hidden="true"
                  />
                )}
                {isFetchNextPageError && (
                  <PublicApiErrorState
                    compact
                    onRetry={() => void fetchNextPage()}
                    isRetrying={isFetchingNextPage}
                  />
                )}
              </div>

              <Link
                href={buildSearchHref(trimmed)}
                onClick={handleViewAllClick}
                className="block border-t px-4 py-3 text-center text-sm font-medium text-secondary hover:bg-muted"
              >
                Xem tất cả kết quả cho &quot;{trimmed}&quot;
              </Link>
            </>
          )}
        </div>
      )}
    </form>
  );
}

function SearchInputFallback({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Input
        disabled
        placeholder="Tìm kiếm sản phẩm..."
        className="h-10 w-full pr-20 lg:min-w-md"
      />
    </div>
  );
}

export const SearchInput = ({
  className = "hidden lg:block",
  onSearched,
}: SearchInputProps) => {
  return (
    <React.Suspense fallback={<SearchInputFallback className={className} />}>
      <SearchForm className={className} onSearched={onSearched} />
    </React.Suspense>
  );
};
