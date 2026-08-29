import { useQuery } from "@tanstack/react-query";

export type ProductSlug = {
  id: string;
  slug: string;
};

async function getProductSlugs(ids: string[]): Promise<ProductSlug[]> {
  if (ids.length === 0) return [];

  const params = new URLSearchParams({ ids: ids.join(",") });
  const res = await fetch(`/api/public/products/slugs?${params.toString()}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải liên kết sản phẩm");
  }
  return data;
}

export function useProductSlugs(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids)).sort();

  return useQuery({
    queryKey: ["product-slugs", uniqueIds],
    queryFn: () => getProductSlugs(uniqueIds),
    enabled: uniqueIds.length > 0,
    staleTime: 5 * 60 * 1000,
    select: (data): Record<string, string> =>
      Object.fromEntries(data.map((p) => [p.id, p.slug])),
  });
}
