import { apiClient } from "@/lib/api-client";
import { PaginatedResponse } from "@/types/shared";
import {
  StockMovement,
  QueryStockMovementsParams,
} from "@/types/stock-movement";

export const stockMovementsApi = {
  list(params: QueryStockMovementsParams = {}) {
    return apiClient.get<PaginatedResponse<StockMovement>>("/api/stock-movements", {
      params: {
        page: params.page,
        limit: params.limit,
        type: params.type,
        warehouseId: params.warehouseId,
        variantId: params.variantId,
      },
    });
  },

  createAdjustment(input: unknown) {
    return apiClient.post("/api/stock-movements/adjustments", input);
  },
};
