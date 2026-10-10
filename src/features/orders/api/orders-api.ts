import { apiClient } from "@/lib/api-client";
import {
  CreateOrderInput,
  OrderDetail,
  OrdersListResponse,
  OrderStatus,
  QueryOrdersParams,
} from "@/types/order";

export const ordersApi = {
  list(params: QueryOrdersParams = {}) {
    return apiClient.get<OrdersListResponse>("/api/orders", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        userId: params.userId,
        search: params.search,
      },
    });
  },

  get(id: string) {
    return apiClient.get<OrderDetail>(`/api/orders/${id}`);
  },

  myOrders(params: QueryOrdersParams = {}) {
    return apiClient.get<OrdersListResponse>("/api/orders/me/list", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        search: params.search,
      },
    });
  },

  myOrder(id: string) {
    return apiClient.get<OrderDetail>(`/api/orders/me/${id}`);
  },

  create(input: CreateOrderInput) {
    return apiClient.post<{ id: string; orderNumber: string }>("/api/orders", input);
  },

  updateStatus(id: string, status: OrderStatus, reason?: string) {
    return apiClient.patch<OrderDetail>(`/api/orders/${id}/status`, { status, reason });
  },

  cancelMyOrder(id: string, reason?: string) {
    return apiClient.post<void>(`/api/orders/me/${id}/cancel`, { reason });
  },
};
