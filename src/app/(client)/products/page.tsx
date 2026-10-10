import { Suspense } from "react";

import {
  ProductListing,
  ProductListingSkeleton,
} from "./_components/product-listing";
import { getPublicProductsPage } from "@/features/products/api/get-public-page-data";
import type { ProductsResponse } from "@/types/product";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : undefined;
  const categoryId =
    typeof query.subCategoryId === "string"
      ? query.subCategoryId
      : typeof query.categoryId === "string"
        ? query.categoryId
        : undefined;
  let initialPage: ProductsResponse | undefined;

  try {
    initialPage = await getPublicProductsPage({
      page: 1,
      limit: 16,
      search,
      categoryId,
      outOfStock: false,
      sortBy: "newest",
    });
  } catch {
    // The client query remains available if the public API is temporarily down.
  }

  return (
    <Suspense fallback={<ProductListingSkeleton title="Sản phẩm" />}>
      <ProductListing
        source="all"
        title="Sản phẩm"
        initialPage={initialPage}
      />
    </Suspense>
  );
}
