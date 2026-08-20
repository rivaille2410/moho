"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useProduct } from "@/features/products/hooks/use-product";

import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ProductDetailHeader } from "@/features/products/components/product-detail/product-detail-header";
import { ProductImagesSection } from "@/features/products/components/product-detail/product-images-section";
import { ProductVariantsSection } from "@/features/products/components/product-detail/product-variants-section";
import { ProductGeneralForm } from "@/features/products/components/product-detail/product-general-form";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: product, isLoading, isError } = useProduct(params.id);

  useBreadcrumbLabel(pathname, product?.name, isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8 text-secondary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
        <p className="text-sm text-muted-foreground">
          Sản phẩm có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <ProductDetailHeader product={product} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="variants">
            Biến thể ({product.variants.length})
          </TabsTrigger>
          <TabsTrigger value="images">
            Hình ảnh (
            {product.images.length +
              product.variants.reduce((sum, v) => sum + v.images.length, 0)}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <ProductGeneralForm product={product} />
        </TabsContent>

        <TabsContent value="variants" className="pt-4">
          <ProductVariantsSection product={product} />
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <ProductImagesSection product={product} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
