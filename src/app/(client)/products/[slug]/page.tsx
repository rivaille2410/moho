import { headers } from "next/headers";

import { getPublicProductBySlug } from "@/features/products/api/get-public-product";
import type { ProductListItem } from "@/types/product";
import ProductDetailClient from "./product-detail-client";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  let product: ProductListItem | null = null;

  if (host) {
    try {
      product = await getPublicProductBySlug(slug, {
        baseUrl: `${protocol}://${host}`,
        cookie: requestHeaders.get("cookie") ?? undefined,
      });
    } catch {
      // Keep the client-side query as a fallback if the server request fails.
    }
  }

  return <ProductDetailClient slug={slug} initialProduct={product} />;
}
