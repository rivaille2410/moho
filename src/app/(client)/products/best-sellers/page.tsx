import { Suspense } from "react";

import {
  ProductListing,
  ProductListingSkeleton,
} from "../_components/product-listing";
import { getPublicBestSellersPage } from "@/features/products/api/get-public-page-data";
import type { ProductsResponse } from "@/types/product";

export default async function BestSellersPage({
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
    initialPage = await getPublicBestSellersPage({
      page: 1,
      limit: 16,
      search,
      categoryId,
    });
  } catch {
    // The client query remains available if the public API is temporarily down.
  }

  return (
    <Suspense fallback={<ProductListingSkeleton title="Sản phẩm bán chạy" />}>
      <ProductListing
        source="best_sellers"
        title="Sản phẩm bán chạy"
        initialPage={initialPage}
      />
    </Suspense>
  );
}
