import { useQuery } from "@tanstack/react-query";

import { getPublicProductBySlug } from "../api/get-public-product";

export const usePublicProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["public-products", slug],
    queryFn: () => getPublicProductBySlug(slug as string),
    enabled: !!slug,
  });
};
