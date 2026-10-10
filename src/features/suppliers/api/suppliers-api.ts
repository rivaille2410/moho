import { apiClient } from "@/lib/api-client";
import { PaginatedResponse } from "@/types/shared";
import { QuerySuppliersParams, Supplier } from "@/types/supplier";

export const suppliersApi = {
  list(params: QuerySuppliersParams = {}) {
    return apiClient.get<PaginatedResponse<Supplier>>("/api/suppliers", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
  },

  get(id: string) {
    return apiClient.get<Supplier>(`/api/suppliers/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<Supplier>("/api/suppliers", input);
  },

  update(id: string, input: unknown) {
    return apiClient.patch<Supplier>(`/api/suppliers/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/suppliers/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<void>("/api/suppliers/bulk-delete", { ids });
  },
};
