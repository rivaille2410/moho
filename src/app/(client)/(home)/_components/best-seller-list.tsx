"use client";

import ProductGrid from "./product-grid";

import {
  QueryBestSellerProductsParams,
  usePublicBestSellerProductsInfinite,
} from "@/features/products/hooks/use-best-seller-products";

interface BestSellerListProps {
  title?: string;
  seeMoreHref?: string;
  params?: Omit<QueryBestSellerProductsParams, "page">;
}

export default function BestSellerList({
  title = "Sản phẩm bán chạy",
  seeMoreHref,
  params = { limit: 12 },
}: BestSellerListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicBestSellerProductsInfinite(params);

  if (isError) return null;

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
    </div>
  );
}
