import { ProductDetailSkeleton } from "@/features/products/components/product-detail/product-detail-skeleton";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";

export default function ProductDetailLoading() {
  return (
    <div className="pb-12">
      <ProductDetailSkeleton />
      <PublicApiLoadingHint className="wrapper mt-4" />
    </div>
  );
}
