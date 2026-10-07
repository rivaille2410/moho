"use client";

import Link from "next/link";
import { useState } from "react";

import { ChevronDown, PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ProductListItem } from "@/types/product";
import { useGridColumns } from "@/hooks/use-grid-columns";

import { ProductCard, ProductCardSkeleton } from "./product-card";

const MOBILE_PREVIEW_COUNT = 4;

const LOAD_MORE_SKELETON_ROWS = 2;

const mobileOnlyPreview = (index: number, collapsed: boolean) =>
  collapsed && index >= MOBILE_PREVIEW_COUNT && "max-sm:hidden";

interface ProductGridProps {
  title?: string;
  hasMore?: boolean;
  isLoading: boolean;
  seeMoreHref?: string;
  skeletonCount?: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  products: ProductListItem[];
}

export function ProductGrid({
  hasMore,
  products,
  isLoading,
  onLoadMore,
  seeMoreHref,
  isLoadingMore,
  title = "Sản phẩm",
  skeletonCount = 6,
}: ProductGridProps) {
  const columns = useGridColumns();
  const [expanded, setExpanded] = useState(false);

  const visibleCount =
    hasMore && products.length >= columns
      ? Math.floor(products.length / columns) * columns
      : products.length;

  const visibleProducts = products.slice(0, visibleCount);
  const isEmpty = !isLoading && products.length === 0;

  const loadMoreSkeletonCount =
    ((columns - (visibleProducts.length % columns)) % columns) +
    columns * LOAD_MORE_SKELETON_ROWS;

  const collapsed = !expanded;
  const showMobileFade =
    collapsed && !isLoading && visibleProducts.length > MOBILE_PREVIEW_COUNT;

  const moreButtonClassName =
    "pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border bg-background py-1.5 px-3 text-sm font-medium text-secondary shadow-xs transition-transform active:scale-95";

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
            <PackageOpen className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Chưa có sản phẩm nào
            </p>
            <p className="text-sm text-muted-foreground">
              Hãy quay lại sau nhé.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <div key={i} className={cn(mobileOnlyPreview(i, collapsed))}>
                    <ProductCardSkeleton />
                  </div>
                ))
              : visibleProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={cn(mobileOnlyPreview(i, collapsed))}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}

            {!isLoading &&
              isLoadingMore &&
              Array.from({ length: loadMoreSkeletonCount }).map((_, i) => (
                <div
                  key={`more-${i}`}
                  className={cn(
                    mobileOnlyPreview(visibleProducts.length + i, collapsed),
                  )}
                >
                  <ProductCardSkeleton />
                </div>
              ))}
          </div>

          {showMobileFade && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:hidden">
              <div className="absolute inset-0 backdrop-blur-[3px] mask-[linear-gradient(to_top,black_45%,transparent)]" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/85 to-transparent" />

              <div className="absolute inset-x-0 bottom-1 flex justify-center">
                {seeMoreHref ? (
                  <Link href={seeMoreHref} className={moreButtonClassName}>
                    Xem thêm
                    <ChevronDown className="size-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className={moreButtonClassName}
                  >
                    Xem thêm
                    <ChevronDown className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && onLoadMore && hasMore && !isLoadingMore && (
        <div
          className={cn(
            "mt-8 flex justify-center",
            collapsed && "max-sm:hidden",
          )}
        >
          <Button
            size={"lg"}
            variant="ghost"
            onClick={onLoadMore}
            className="text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            Xem thêm
            <ChevronDown className="size-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
