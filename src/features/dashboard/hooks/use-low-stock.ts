import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";
import { queryKeys } from "@/lib/query-keys";
import { LowStockParams, LowStockVariant } from "@/types/dashboard";

export function useLowStock(params: LowStockParams = {}) {
  return useQuery<LowStockVariant[]>({
    queryKey: queryKeys.dashboard.lowStock(),
    queryFn: () => dashboardApi.lowStock(params),
  });
}
