"use client";

import ProductGrid from "./product-grid";

import {
  usePublicProductsInfinite,
  type QueryPublicProductsParams,
} from "@/features/products/hooks/use-public-products";

interface ProductListProps {
  title?: string;
  seeMoreHref?: string;
  params?: Omit<QueryPublicProductsParams, "page">;
}

export default function ProductList({
  title = "Sản phẩm",
  seeMoreHref,
  params = { limit: 12 },
}: ProductListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicProductsInfinite(params);

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
