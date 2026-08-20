import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/currency";
import { ProductListItem } from "@/types/product";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function getThumbnailUrl(product: ProductListItem): string | undefined {
  const thumb = product.images.find((img) => img.isThumbnail);
  return (thumb ?? product.images[0])?.url;
}

function getDiscountPercent(product: ProductListItem): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return null;
  }
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

function getVariantColors(product: ProductListItem) {
  return product.variants
    .filter((v) => v.colorHex)
    .map((v) => ({ name: v.name, hex: v.colorHex as string }));
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const thumbnailUrl = getThumbnailUrl(product);
  const discountPercent = getDiscountPercent(product);
  const colors = getVariantColors(product);
  const inStock = product.totalStock > 0;

  const priceLabel = formatVND(product.price);
  const oldPriceLabel = product.compareAtPrice
    ? formatVND(product.compareAtPrice)
    : undefined;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-muted">
        {discountPercent !== null && (
          <Badge className="absolute left-2 top-2 z-10 rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs font-bold text-background">
            -{discountPercent}%
          </Badge>
        )}

        {!inStock && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 z-10 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-[11px] text-background"
          >
            Hết hàng
          </Badge>
        )}

        {thumbnailUrl && (
          <Image
            fill
            src={thumbnailUrl}
            alt={product.name}
            className="object-cover"
            sizes="(min-width: 1536px) 16vw, (min-width: 768px) 20vw, 50vw"
          />
        )}
      </div>

      <p className="mb-1.5 min-h-9.5 text-sm sm:text-base font-semibold leading-snug text-foreground group-hover:text-secondary transition line-clamp-2">
        {product.name}
      </p>

      <div className="mb-1 flex items-baseline gap-1.5 sm:gap-2">
        <span className="text-sm sm:text-base font-semibold text-[#e2543a]">
          {priceLabel}
        </span>
        {oldPriceLabel && (
          <span className="text-[11px] sm:text-[13px] text-muted-foreground line-through">
            {oldPriceLabel}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] text-muted-foreground">
        <span />
        <span>Đã bán {product.soldCount}</span>
      </div>

      {colors.length > 0 && (
        <div className="mt-2 flex gap-1 sm:gap-1.5">
          {colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className={cn("size-5 sm:size-6 rounded-full ring-1 ring-border")}
              style={{ backgroundColor: c.hex, border: "2px solid white" }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-3 aspect-square rounded-md" />
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="mb-1 h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
