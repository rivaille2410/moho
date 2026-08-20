"use client";

import Image from "next/image";
import { useMemo, useState, useRef, useEffect, useCallback, use } from "react";

import DOMPurify from "dompurify";
import Autoplay from "embla-carousel-autoplay";
import { Minus, Plus, CheckCircle2 } from "lucide-react";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";
import ProductGrid from "../../(home)/_components/product-grid";
import { usePublicProduct } from "@/features/products/hooks/use-public-product";
import { useRelatedProducts } from "@/features/products/hooks/use-related-products";
import ProductDetailSkeleton from "@/features/products/components/product-detail/product-detail-skeleton";
import ProductNotFound from "@/features/products/components/product-detail/product-not-found";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = usePublicProduct(slug);

  const {
    data: relatedData,
    isLoading: isLoadingRelated,
    hasNextPage: hasMoreRelated,
    fetchNextPage: fetchNextRelated,
    isFetchingNextPage: isFetchingMoreRelated,
  } = useRelatedProducts(slug, { limit: 12 });

  const relatedProducts = relatedData?.pages.flatMap((page) => page.data) ?? [];

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    if (!product) return undefined;
    return (
      product.variants.find((v) => v.id === selectedVariantId) ??
      product.variants[0]
    );
  }, [product, selectedVariantId]);

  const images = useMemo(() => {
    if (!product) return [];
    if (selectedVariant?.images.length) return selectedVariant.images;
    return product.images;
  }, [product, selectedVariant]);

  const sanitizedDescription = useMemo(() => {
    if (!product?.description) return null;
    return DOMPurify.sanitize(product.description);
  }, [product?.description]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setActiveImageIndex(index);
      carouselApi?.scrollTo(index);
    },
    [carouselApi],
  );

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    carouselApi?.scrollTo(0);
  }, [carouselApi, selectedVariant?.id]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return <ProductNotFound />;
  }

  const price = selectedVariant?.priceOverride ?? product.price;
  const compareAtPrice = product.compareAtPrice;
  const discountPercent = compareAtPrice
    ? Math.round((1 - price / compareAtPrice) * 100)
    : null;
  const savings = compareAtPrice ? compareAtPrice - price : null;
  const maxStock = selectedVariant?.stock ?? product.totalStock;

  const dimensions = [
    product.length ? `Dài ${product.length}cm` : null,
    product.width ? `Rộng ${product.width}cm` : null,
    product.height ? `Cao ${product.height}cm` : null,
  ]
    .filter(Boolean)
    .join(" x ");

  return (
    <div className="wrapper space-y-3">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tất cả sản phẩm", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="flex flex-col-reverse gap-3 md:sticky md:top-20 lg:flex-row">
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative size-17.5 shrink-0 overflow-hidden rounded-md border transition",
                  index === activeImageIndex
                    ? "border-secondary ring-3 ring-secondary/40"
                    : "border-border hover:border-secondary hover:ring-3 hover:ring-secondary/40",
                )}
              >
                <Image
                  fill
                  sizes="70px"
                  src={image.url}
                  alt={product.name}
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <Carousel
            setApi={setCarouselApi}
            plugins={[autoplayPlugin.current]}
            className="flex-1"
            opts={{ loop: true }}
          >
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      fill
                      priority
                      alt={product.name}
                      className="object-cover"
                      src={image.url}
                      sizes="(min-width: 768px) 560px, 100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-snug">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Đã bán:{" "}
            <span className="font-medium text-foreground">
              {product.soldCount}
            </span>
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            SKU:{" "}
            <span className="font-medium text-foreground">{product.sku}</span>
          </p>

          <div className="my-4 h-px bg-border" />

          <div className="flex items-baseline gap-3">
            {discountPercent ? (
              <span className="rounded bg-secondary px-2 py-1 text-sm font-bold text-white">
                -{discountPercent}%
              </span>
            ) : null}
            <span className="text-2xl font-bold text-secondary">
              {formatVND(price)}
            </span>
            {compareAtPrice ? (
              <span className="text-muted-foreground line-through">
                {formatVND(compareAtPrice)}
              </span>
            ) : null}
          </div>

          {savings && savings > 0 ? (
            <p className="mt-3 text-sm font-semibold text-secondary">
              Tiết kiệm {formatVND(savings)} so với mua lẻ
            </p>
          ) : null}

          {product.variants.length > 0 ? (
            <p className="mt-4 text-sm font-medium">{selectedVariant?.name}</p>
          ) : null}

          {product.variants.length > 0 ? (
            <div className="mt-4 flex gap-2">
              {product.variants.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  title={variant.name}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setActiveImageIndex(0);
                    setQuantity(1);
                  }}
                  className={cn(
                    "size-9 rounded-full border transition",
                    selectedVariant?.id === variant.id
                      ? "border-secondary ring-3 ring-secondary/40"
                      : "border-border",
                  )}
                  style={{ backgroundColor: variant.colorHex ?? "#e5e5e5" }}
                />
              ))}
            </div>
          ) : null}

          {dimensions ? (
            <p className="mt-5 text-sm">
              <span className="font-semibold">Kích thước:</span> {dimensions}
            </p>
          ) : null}

          {product.materials.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-semibold">Chất liệu:</p>
              <ul className="mt-1 space-y-1.5 text-sm text-muted-foreground">
                {product.materials.map((material) => (
                  <li key={material.id}>
                    - {material.label}: {material.value}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border">
              <button
                type="button"
                className="p-2.5 disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 border-x py-2 text-center text-sm">
                {quantity}
              </span>
              <button
                type="button"
                className="p-2.5 disabled:opacity-40"
                disabled={quantity >= maxStock}
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              {maxStock > 0 ? `Còn ${maxStock} sản phẩm` : "Hết hàng"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button size={"xl"} disabled={maxStock === 0}>
              Thêm vào giỏ
            </Button>
            <Button size={"xl"} variant={"secondary"} disabled={maxStock === 0}>
              Mua ngay
            </Button>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
              Miễn phí giao hàng & lắp đặt tại tất cả quận huyện thuộc TP.HCM,
              Hà Nội, Khu đô thị Ecopark, Biên Hòa và một số quận thuộc Bình
              Dương
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" />
              Miễn phí 1 đổi 1 - Bảo hành 5 năm - Bảo trì trọn đời
            </li>
            <li className="flex items-start gap-2">
              (*) Không áp dụng cho danh mục Đồ Trang Trí và Nệm
            </li>
            <li className="flex items-start gap-2">
              (**) Không áp dụng cho các sản phẩm Clearance. Chỉ bảo hành 01 năm
              cho khung ghế, mâm và cần đối với Ghế Văn Phòng
            </li>
          </ul>
        </div>
      </div>

      {sanitizedDescription ? (
        <div className="rounded-lg border mt-10">
          <div className="border-b pt-3 pb-2 px-4">
            <span className="text-lg font-semibold">Mô tả sản phẩm</span>
          </div>
          <div className="py-8 px-4">
            <div
              className="prose prose-sm max-w-none prose-img:rounded-lg prose-img:mx-auto prose-img:block"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>
        </div>
      ) : null}

      {(isLoadingRelated || relatedProducts.length > 0) && (
        <ProductGrid
          skeletonCount={6}
          hasMore={hasMoreRelated}
          title="Sản phẩm tương tự"
          products={relatedProducts}
          isLoading={isLoadingRelated}
          onLoadMore={() => fetchNextRelated()}
          isLoadingMore={isFetchingMoreRelated}
        />
      )}
    </div>
  );
}
