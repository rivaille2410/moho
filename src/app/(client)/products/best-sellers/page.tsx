import { Suspense } from "react";

import {
  ProductListing,
  ProductListingSkeleton,
} from "../_components/product-listing";

export default function BestSellersPage() {
  return (
    <Suspense fallback={<ProductListingSkeleton title="Sản phẩm bán chạy" />}>
      <ProductListing source="best_sellers" title="Sản phẩm bán chạy" />
    </Suspense>
  );
}
