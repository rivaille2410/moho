import { useQuery } from "@tanstack/react-query";
import { suppliersApi } from "../api/suppliers-api";
import { queryKeys } from "@/lib/query-keys";
import { Supplier } from "@/types/supplier";

export function useSupplier(id: string) {
  return useQuery<Supplier>({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => suppliersApi.get(id),
    enabled: !!id,
  });
}
