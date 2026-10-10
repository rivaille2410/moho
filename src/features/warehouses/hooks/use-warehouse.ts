import { useQuery } from "@tanstack/react-query";
import { warehousesApi } from "../api/warehouses-api";
import { queryKeys } from "@/lib/query-keys";
import { Warehouse } from "@/types/warehouse";

export function useWarehouse(id: string | undefined) {
  return useQuery<Warehouse>({
    queryKey: queryKeys.warehouses.detail(id ?? ""),
    queryFn: () => warehousesApi.get(id as string),
    enabled: !!id,
  });
}
