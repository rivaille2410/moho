import { Suspense } from "react";

import {
  ProductListing,
  ProductListingSkeleton,
} from "./_components/product-listing";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListingSkeleton title="Sản phẩm" />}>
      <ProductListing source="all" title="Sản phẩm" />
    </Suspense>
  );
}
