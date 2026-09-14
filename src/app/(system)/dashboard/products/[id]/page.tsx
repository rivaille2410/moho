"use client";

import { useParams, usePathname } from "next/navigation";

import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";
import { useProduct } from "@/features/products/hooks/use-product";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ProductDetailHeader } from "@/features/products/components/product-detail/product-detail-header";
import { ProductImagesSection } from "@/features/products/components/product-detail/product-images-section";
import { ProductVariantsSection } from "@/features/products/components/product-detail/product-variants-section";
import { ProductGeneralForm } from "@/features/products/components/product-detail/product-general-form";

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-1 rounded-md bg-muted p-1 w-fit">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-56" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-36" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="size-9 shrink-0" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="size-9 shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: product, isLoading, isError } = useProduct(params.id);

  useBreadcrumbLabel(pathname, product?.name, isLoading);

  if (isLoading) {
    return <ProductDetailSkeleton />;
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
