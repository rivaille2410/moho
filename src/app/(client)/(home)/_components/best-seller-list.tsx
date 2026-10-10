"use client";

import { ProductGrid } from "./product-grid";
import type { ProductsResponse } from "@/types/product";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";

import {
  usePublicBestSellersInfinite,
  type QueryPublicProductsParams,
} from "@/features/products/hooks/use-public-products";

interface BestSellerListProps {
  title?: string;
  seeMoreHref?: string;
  params?: Omit<QueryPublicProductsParams, "page">;
  initialPage?: ProductsResponse;
}

export default function BestSellerList({
  title = "Sản phẩm bán chạy",
  seeMoreHref,
  params = { limit: 12 },
  initialPage,
}: BestSellerListProps) {
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
  } = usePublicBestSellersInfinite(params, initialPage);

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

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="wrapper">
      <ProductGrid
        title={title}
        products={products}
        isLoading={isLoading}
        hasMore={hasNextPage}
        seeMoreHref={seeMoreHref}
        onLoadMore={() => fetchNextPage()}
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
