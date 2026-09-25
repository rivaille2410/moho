import { useQuery } from "@tanstack/react-query";

import { PaginationMeta } from "@/types/shared";
import { QueryShipmentsParams, Shipment } from "@/types/shipment";

interface ShipmentListResponse {
  data: Shipment[];
  meta: PaginationMeta;
}

function buildQueryString(params: QueryShipmentsParams) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.orderId) search.set("orderId", params.orderId);
  if (params.search) search.set("search", params.search);

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function fetchShipments(
  params: QueryShipmentsParams,
): Promise<ShipmentListResponse> {
  const res = await fetch(`/api/shipments${buildQueryString(params)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách vận đơn");
  }
  return data;
}

export function useShipments(params: QueryShipmentsParams = {}) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => fetchShipments(params),
  });
}
