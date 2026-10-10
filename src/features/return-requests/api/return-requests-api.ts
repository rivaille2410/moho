import { apiClient } from "@/lib/api-client";
import {
  PaginatedReturnRequests,
  QueryReturnRequestsInput,
  ReturnRequest,
} from "@/types/return-request";

export const returnRequestsApi = {
  list(query: QueryReturnRequestsInput = {}) {
    return apiClient.get<PaginatedReturnRequests>("/api/admin/return-requests", {
      params: {
        search: query.search,
        status: query.status,
        page: query.page,
        limit: query.limit,
      },
    });
  },

  get(id: string) {
    return apiClient.get<ReturnRequest>(`/api/admin/return-requests/${id}`);
  },

  myList(params?: Record<string, unknown>) {
    return apiClient.get<PaginatedReturnRequests>("/api/return-requests/me", {
      params: params as Record<string, string | number | boolean>,
    });
  },

  myDetail(id: string) {
    return apiClient.get<ReturnRequest>(`/api/return-requests/me/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<ReturnRequest>("/api/return-requests", input);
  },

  approve(id: string, input?: unknown) {
    return apiClient.patch<void>(`/api/admin/return-requests/${id}/approve`, input);
  },

  reject(id: string, reason: string) {
    return apiClient.patch<void>(`/api/admin/return-requests/${id}/reject`, { reason });
  },

  cancel(id: string) {
    return apiClient.patch<void>(`/api/return-requests/${id}/cancel`);
  },
};
