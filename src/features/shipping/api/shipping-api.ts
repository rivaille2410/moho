import { apiClient } from "@/lib/api-client";
import type {
  CalculateShippingFeeInput,
  ShippingFeeQuote,
} from "@/types/shipping";

export const shippingApi = {
  calculate(input: CalculateShippingFeeInput) {
    return apiClient.post<ShippingFeeQuote>("/api/shipping/calculate", input);
  },
};
