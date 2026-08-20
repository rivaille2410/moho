import { type ProductListItem } from "@/types/product";

export async function getProduct(
  id: string,
  options?: { baseUrl?: string; cookie?: string },
): Promise<ProductListItem> {
  const url = `${options?.baseUrl ?? ""}/api/products/${id}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: options?.cookie ? { cookie: options.cookie } : undefined,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
