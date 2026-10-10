"use client";

import { ProductGrid } from "./product-grid";

import { usePublicCategories } from "@/features/categories/hooks/use-public-categories";
import { usePublicProductsInfinite } from "@/features/products/hooks/use-public-products";
import type { ProductsResponse, PublicCategory } from "@/types/product";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";

const PRODUCTS_PER_CATEGORY = 12;

interface CategoryProductListProps {
  categoryId: string;
  title: string;
  initialPage?: ProductsResponse;
}

function CategoryProductList({
  categoryId,
  title,
  initialPage,
}: CategoryProductListProps) {
  const { data, isLoading, isLoadingError, isFetching, refetch } = usePublicProductsInfinite(
    {
      categoryId,
      limit: PRODUCTS_PER_CATEGORY,
    },
    initialPage,
  );

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

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="wrapper">
      <ProductGrid
        title={title}
        products={products}
        isLoading={isLoading}
        hasMore={data?.pages.at(-1)?.meta.hasNextPage}
        skeletonCount={PRODUCTS_PER_CATEGORY}
        seeMoreHref={`/products?categoryId=${categoryId}`}
      />
    </div>
  );
}

interface CategoryProductListsProps {
  maxCategories?: number;
  initialCategories?: PublicCategory[];
  initialProducts?: Record<string, ProductsResponse>;
}

export default function CategoryProductLists({
  maxCategories,
  initialCategories,
  initialProducts,
}: CategoryProductListsProps) {
  const {
    data: categories,
    isLoadingError: categoriesLoadingError,
    isFetching: categoriesFetching,
    refetch: refetchCategories,
  } = usePublicCategories(
    { rootOnly: true },
    undefined,
    initialCategories,
  );

  if (categoriesLoadingError) {
    return (
      <div className="wrapper">
        <PublicApiErrorState
          compact
          onRetry={() => void refetchCategories()}
          isRetrying={categoriesFetching}
        />
      </div>
    );
  }
  if (!categories?.length) return null;

  const visibleCategories = maxCategories
    ? categories.slice(0, maxCategories)
    : categories;

  return (
    <>
      {visibleCategories.map((category) => (
        <CategoryProductList
          key={category.id}
          title={category.name}
          categoryId={category.id}
          initialPage={initialProducts?.[category.id]}
        />
      ))}
    </>
  );
}
