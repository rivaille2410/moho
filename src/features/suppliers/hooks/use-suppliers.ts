import { useQuery } from "@tanstack/react-query";
import { suppliersApi } from "../api/suppliers-api";
import { queryKeys } from "@/lib/query-keys";
import { PaginatedResponse } from "@/types/shared";
import { QuerySuppliersParams, Supplier } from "@/types/supplier";

export function useSuppliers(params: QuerySuppliersParams = {}) {
  return useQuery<PaginatedResponse<Supplier>>({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => suppliersApi.list(params),
  });
}
