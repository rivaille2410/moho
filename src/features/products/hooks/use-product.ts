import { useQuery } from "@tanstack/react-query";

import { getProduct } from "@/features/products/api/get-product";

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id as string),
    enabled: !!id,
  });
};
