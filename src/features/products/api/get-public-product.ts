import { ProductListItem } from "@/types/product";

interface FetchOptions {
  baseUrl?: string;
  cookie?: string;
}

export async function getPublicProductBySlug(
  slug: string,
  options?: FetchOptions,
): Promise<ProductListItem> {
  const path = `/api/public/products/${slug}`;
  const url = options?.baseUrl ? `${options.baseUrl}${path}` : path;

  const res = await fetch(url, {
    method: "GET",
    headers: options?.cookie ? { cookie: options.cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch public product");
  }

  return res.json();
}
