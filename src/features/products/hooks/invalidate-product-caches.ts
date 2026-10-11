import type { QueryClient } from "@tanstack/react-query";

/** Refresh public catalog data after a product or inventory mutation. */
export function invalidatePublicProductCaches(queryClient: QueryClient) {
  return Promise.all(
    [
      ["public-products-infinite"],
      ["public-best-sellers-infinite"],
      ["public-products"],
      ["related-products"],
      ["public-colors"],
      ["product-slugs"],
      ["dashboard", "low-stock"],
      ["dashboard-top-products"],
    ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}

export function invalidateProductAndPublicCaches(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["products"] }),
    invalidatePublicProductCaches(queryClient),
  ]);
}
