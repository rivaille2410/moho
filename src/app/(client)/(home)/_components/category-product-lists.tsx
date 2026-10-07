"use client";

import { ProductGrid } from "./product-grid";

import { usePublicCategories } from "@/features/categories/hooks/use-public-categories";
import { usePublicProductsInfinite } from "@/features/products/hooks/use-public-products";

const PRODUCTS_PER_CATEGORY = 12;

interface CategoryProductListProps {
  categoryId: string;
  title: string;
}

function CategoryProductList({ categoryId, title }: CategoryProductListProps) {
  const { data, isLoading, isError } = usePublicProductsInfinite({
    categoryId,
    limit: PRODUCTS_PER_CATEGORY,
  });

  if (isError) return null;

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
}

export default function CategoryProductLists({
  maxCategories,
}: CategoryProductListsProps) {
  const { data: categories } = usePublicCategories({ rootOnly: true });

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
        />
      ))}
    </>
  );
}
