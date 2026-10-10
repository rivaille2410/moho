import { apiClient } from "@/lib/api-client";
import { Warehouse } from "@/types/warehouse";

export const warehousesApi = {
  list(params?: Record<string, unknown>) {
    return apiClient.get<Warehouse[]>("/api/warehouses", { params: params as Record<string, string | number | boolean> });
  },

  get(id: string) {
    return apiClient.get<Warehouse>(`/api/warehouses/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<Warehouse>("/api/warehouses", input);
  },

  update(id: string, input: unknown) {
    return apiClient.patch<Warehouse>(`/api/warehouses/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/warehouses/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<void>("/api/warehouses/bulk-delete", { ids });
  },
};
