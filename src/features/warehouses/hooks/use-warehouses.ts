import { useQuery } from "@tanstack/react-query";
import { warehousesApi } from "../api/warehouses-api";
import { queryKeys } from "@/lib/query-keys";
import { Warehouse } from "@/types/warehouse";

export function useWarehouses() {
  return useQuery<Warehouse[]>({
    queryKey: queryKeys.warehouses.all,
    queryFn: () => warehousesApi.list(),
  });
}
