import { apiClient } from "@/lib/api-client";
import { PaginatedResponse } from "@/types/shared";
import {
  PurchaseOrder,
  QueryPurchaseOrdersParams,
} from "@/types/purchase-order";

export const purchaseOrdersApi = {
  list(params: QueryPurchaseOrdersParams = {}) {
    return apiClient.get<PaginatedResponse<PurchaseOrder>>("/api/purchase-orders", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        warehouseId: params.warehouseId,
        supplierId: params.supplierId,
      },
    });
  },

  get(id: string) {
    return apiClient.get<PurchaseOrder>(`/api/purchase-orders/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<PurchaseOrder>("/api/purchase-orders", input);
  },

  receive(id: string, input: unknown) {
    return apiClient.post<void>(`/api/purchase-orders/${id}/receive`, input);
  },

  updateStatus(id: string, status: string, note?: string) {
    return apiClient.patch<void>(`/api/purchase-orders/${id}/status`, { status, note });
  },
};
