import { useQuery } from "@tanstack/react-query";
import { stockMovementsApi } from "../api/stock-movements-api";
import { queryKeys } from "@/lib/query-keys";
import { PaginatedResponse } from "@/types/shared";
import { StockMovement, QueryStockMovementsParams } from "@/types/stock-movement";

export function useStockMovements(params: QueryStockMovementsParams = {}) {
  return useQuery<PaginatedResponse<StockMovement>>({
    queryKey: queryKeys.stockMovements.list(params),
    queryFn: () => stockMovementsApi.list(params),
  });
}
