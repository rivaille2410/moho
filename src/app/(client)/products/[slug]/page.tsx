"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect, useCallback, use } from "react";

import {
  Minus,
  Plus,
  ZoomIn,
  ImageOff,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import DOMPurify from "dompurify";
import Autoplay from "embla-carousel-autoplay";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";
import { ProductGrid } from "../../(home)/_components/product-grid";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCartView } from "@/features/cart/hooks/use-cart-view";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { usePublicProduct } from "@/features/products/hooks/use-public-product";
import { useRelatedProducts } from "@/features/products/hooks/use-related-products";
import { ProductDetailSkeleton } from "@/features/products/components/product-detail/product-detail-skeleton";
import { ProductReviewsContainer } from "@/features/products/components/product-detail/product-reviews-container";
import { ProductNotFound } from "@/features/products/components/product-detail/product-not-found";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError } = usePublicProduct(slug);
  const { addItem } = useCartView();

  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const DESCRIPTION_COLLAPSED_HEIGHT = 480;

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isDescOverflowing, setIsDescOverflowing] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

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

  const lightboxSlides = useMemo(
    () =>
      images.map((image) => ({
        src: image.url,
        alt: product?.name ?? "",
      })),
    [images, product?.name],
  );

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

  const openLightbox = useCallback(() => {
    autoplayPlugin.current.stop();
    setIsLightboxOpen(true);
  }, []);

  const handleLightboxView = useCallback(
    (index: number) => {
      setActiveImageIndex(index);
      carouselApi?.scrollTo(index, true);
    },
    [carouselApi],
  );

  useEffect(() => {
    if (!descRef.current) return;
    setIsDescOverflowing(
      descRef.current.scrollHeight > DESCRIPTION_COLLAPSED_HEIGHT,
    );
  }, [sanitizedDescription]);

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

  useEffect(() => {
    const container = thumbsRef.current;
    const el = container?.children[activeImageIndex] as HTMLElement | undefined;
    if (!container || !el) return;

    const c = container.getBoundingClientRect();
    const e = el.getBoundingClientRect();

    container.scrollBy({
      top: e.top - c.top - (c.height - e.height) / 2,
      left: e.left - c.left - (c.width - e.width) / 2,
      behavior: "smooth",
    });
  }, [activeImageIndex]);

  if (isLoading) {
    return (
      <div className="pb-12">
        <ProductDetailSkeleton />
      </div>
    );
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
  const isOutOfStock = maxStock === 0;

  const dimensions = [
    product.length ? `Dài ${product.length}cm` : null,
    product.width ? `Rộng ${product.width}cm` : null,
    product.height ? `Cao ${product.height}cm` : null,
  ]
    .filter(Boolean)
    .join(" x ");

  const buildCartItem = () => ({
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    sku: product.sku,
    variantId: selectedVariant?.id ?? product.id,
    variantName: selectedVariant?.name ?? "",
    variantColor: selectedVariant?.colorHex ?? null,
    thumbnailUrl: images[0]?.url ?? null,
    price,
    compareAtPrice: compareAtPrice ?? null,
    dimensions: dimensions || null,
    materials:
      product.materials.length > 0
        ? product.materials.map((m) => `${m.label}: ${m.value}`).join(", ")
        : null,
    maxStock,
  });

  const handleAddToCart = () => {
    if (maxStock === 0) return;
    addItem(buildCartItem(), quantity);
  };

  const handleBuyNow = () => {
    if (maxStock === 0) return;
    addItem(buildCartItem(), quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-3">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tất cả sản phẩm", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="wrapper space-y-3">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          {images.length > 0 ? (
            <div className="flex flex-col-reverse gap-3 md:sticky md:top-20 lg:grid lg:grid-cols-[78px_1fr]">
              <div className="relative">
                <div
                  ref={thumbsRef}
                  className="flex gap-2 overflow-x-auto p-1 px-2 -mx-2 lg:absolute lg:inset-0 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
                >
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
              </div>

              <Carousel
                setApi={setCarouselApi}
                plugins={[autoplayPlugin.current]}
                className="min-w-0"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.id}>
                      <button
                        type="button"
                        onClick={openLightbox}
                        aria-label="Phóng to ảnh sản phẩm"
                        className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          fill
                          priority
                          alt={product.name}
                          className="object-cover"
                          src={image.url}
                          sizes="(min-width: 768px) 560px, 100vw"
                        />
                        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-background/80 p-2 opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100">
                          <ZoomIn className="size-4" />
                        </span>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                index={activeImageIndex}
                slides={lightboxSlides}
                plugins={[Zoom, Thumbnails]}
                carousel={{ finite: images.length <= 1 }}
                zoom={{
                  maxZoomPixelRatio: 3,
                  scrollToZoom: true,
                  doubleClickMaxStops: 2,
                }}
                thumbnails={{
                  width: 72,
                  height: 72,
                  gap: 8,
                  border: 0,
                  borderRadius: 6,
                  position: "bottom",
                }}
                on={{ view: ({ index }) => handleLightboxView(index) }}
                render={
                  images.length <= 1
                    ? { buttonPrev: () => null, buttonNext: () => null }
                    : undefined
                }
              />
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-lg bg-muted md:sticky md:top-20">
              <div className="flex size-14 items-center justify-center rounded-full bg-background">
                <ImageOff className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh sản phẩm
              </p>
            </div>
          )}

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
              <p className="mt-4 text-sm font-medium">
                {selectedVariant?.name}
              </p>
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

            {!isAdmin && (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center rounded-md border">
                    <button
                      type="button"
                      className="p-2.5 disabled:opacity-40"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 border-x py-2 text-center text-sm">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      type="button"
                      className="p-2.5 disabled:opacity-40"
                      disabled={isOutOfStock || quantity >= maxStock}
                      onClick={() =>
                        setQuantity((q) => Math.min(maxStock, q + 1))
                      }
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      isOutOfStock
                        ? "font-medium text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {isOutOfStock ? "Hết hàng" : `Còn ${maxStock} sản phẩm`}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  <Button
                    size="xl"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    size="xl"
                    variant="secondary"
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                  >
                    Mua ngay
                  </Button>
                </div>
              </>
            )}

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
                (**) Không áp dụng cho các sản phẩm Clearance. Chỉ bảo hành 01
                năm cho khung ghế, mâm và cần đối với Ghế Văn Phòng
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border mt-10">
          <Tabs defaultValue="description">
            <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent px-4 py-0">
              <TabsTrigger
                value="description"
                className="rounded-none shadow-none! px-0 py-3 text-base font-semibold text-muted-foreground data-[state=active]:bg-transparent"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none shadow-none! px-0 py-3 text-base font-semibold text-muted-foreground data-[state=active]:bg-transparent"
              >
                Đánh giá sản phẩm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="px-4 py-8">
              {sanitizedDescription ? (
                <div className="relative">
                  <div
                    ref={descRef}
                    className={cn(
                      "prose prose-sm max-w-none overflow-hidden prose-img:mx-auto prose-img:block prose-img:rounded-lg transition-[max-height] duration-500 ease-in-out",
                      !isDescExpanded && "max-h-320",
                    )}
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />

                  {!isDescExpanded && isDescOverflowing && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/80 to-transparent" />
                  )}

                  {isDescOverflowing && (
                    <div
                      className={cn(
                        "relative flex justify-center",
                        !isDescExpanded && "-mt-6",
                        isDescExpanded && "sticky bottom-4 z-10 mt-4",
                      )}
                    >
                      <Button
                        size={"lg"}
                        variant="outline"
                        onClick={() => setIsDescExpanded((prev) => !prev)}
                        className={cn(
                          "gap-1.5",
                          isDescExpanded &&
                            "shadow-lg backdrop-blur-sm bg-background/90",
                        )}
                      >
                        {isDescExpanded ? "Thu gọn" : "Xem thêm"}
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300",
                            isDescExpanded && "rotate-180",
                          )}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có mô tả cho sản phẩm này.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="px-4 py-8">
              <ProductReviewsContainer slug={product.slug} />
            </TabsContent>
          </Tabs>
        </div>

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
    </div>
  );
}
