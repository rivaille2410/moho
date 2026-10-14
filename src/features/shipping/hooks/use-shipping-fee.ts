import { useQuery } from "@tanstack/react-query";

import { shippingApi } from "../api/shipping-api";
import type { CalculateShippingFeeInput } from "@/types/shipping";

export function useShippingFee(
  input: CalculateShippingFeeInput | null,
) {
  return useQuery({
    queryKey: ["shipping-fee", input],
    queryFn: () => shippingApi.calculate(input!),
    enabled: Boolean(input?.addressId && input.deliveryDate && input.items.length),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
