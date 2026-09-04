"use client";

import Link from "next/link";

import { ChevronDown, PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { ProductListItem } from "@/types/product";
import { useGridColumns } from "@/hooks/use-grid-columns";

import { ProductCard, ProductCardSkeleton } from "./product-card";

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
  skeletonCount = 12,
}: ProductGridProps) {
  const columns = useGridColumns();

  const visibleCount =
    products.length < columns
      ? products.length
      : Math.floor(products.length / columns) * columns;

  const visibleProducts = products.slice(0, visibleCount);

  const hasHiddenRemainder = visibleCount < products.length;
  const isEmpty = !isLoading && products.length === 0;

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
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
            className="text-secondary hover:text-secondary hover:bg-secondary/10"
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
