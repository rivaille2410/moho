import { apiClient } from "@/lib/api-client";
import { PaginationMeta } from "@/types/shared";
import {
  CreateShipmentInput,
  QueryShipmentsParams,
  Shipment,
  UpdateShipmentInput,
  UpdateShipmentStatusInput,
} from "@/types/shipment";

export interface ShipmentListResponse {
  data: Shipment[];
  meta: PaginationMeta;
}

export const shipmentsApi = {
  list(params: QueryShipmentsParams = {}) {
    return apiClient.get<ShipmentListResponse>("/api/shipments", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        orderId: params.orderId,
        search: params.search,
      },
    });
  },

  get(id: string) {
    return apiClient.get<Shipment>(`/api/shipments/${id}`);
  },

  create(input: CreateShipmentInput) {
    return apiClient.post<Shipment>("/api/shipments", input);
  },

  update(id: string, input: UpdateShipmentInput) {
    return apiClient.patch<Shipment>(`/api/shipments/${id}`, input);
  },

  updateStatus(id: string, input: UpdateShipmentStatusInput) {
    return apiClient.patch<Shipment>(`/api/shipments/${id}/status`, input);
  },

  shippableOrders() {
    return apiClient.get<unknown[]>("/api/shipments/shippable-orders");
  },
};
