import { apiClient } from "@/lib/api-client";
import { LowStockParams, LowStockVariant } from "@/types/dashboard";

export const dashboardApi = {
  lowStock(params: LowStockParams = {}) {
    return apiClient.get<LowStockVariant[]>("/api/dashboard/low-stock", {
      params: {
        threshold: params.threshold,
        limit: params.limit,
      },
    });
  },

  revenueChart(range: string) {
    return apiClient.get<unknown>("/api/dashboard/revenue-chart", {
      params: { range },
    });
  },

  ordersChart(range: string) {
    return apiClient.get<unknown>("/api/dashboard/orders-chart", {
      params: { range },
    });
  },

  orderStatusDistribution(range: string) {
    return apiClient.get<unknown>("/api/dashboard/order-status-distribution", {
      params: { range },
    });
  },

  topCustomers(params: { range?: string; limit?: number } = {}) {
    return apiClient.get<unknown>("/api/dashboard/top-customers", {
      params: {
        range: params.range,
        limit: params.limit,
      },
    });
  },

  topProducts(params: { range?: string; limit?: number } = {}) {
    return apiClient.get<unknown>("/api/dashboard/top-products", {
      params: {
        range: params.range,
        limit: params.limit,
      },
    });
  },

  recentOrders() {
    return apiClient.get<unknown>("/api/dashboard/recent-orders");
  },

  activeVouchers() {
    return apiClient.get<unknown>("/api/dashboard/active-vouchers");
  },
};
