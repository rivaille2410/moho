import { useQuery } from "@tanstack/react-query";

import {
  StockMovement,
  QueryStockMovementsParams,
} from "@/types/stock-movement";
import { PaginatedResponse } from "@/types/shared";

async function fetchStockMovements(
  params: QueryStockMovementsParams,
): Promise<PaginatedResponse<StockMovement>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const res = await fetch(`/api/stock-movements${qs ? `?${qs}` : ""}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Không thể tải lịch sử tồn kho");
  }

  return res.json();
}

export function useStockMovements(params: QueryStockMovementsParams = {}) {
  return useQuery({
    queryKey: ["stock-movements", params],
    queryFn: () => fetchStockMovements(params),
  });
}
