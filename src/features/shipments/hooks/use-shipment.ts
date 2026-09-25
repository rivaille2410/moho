import { useQuery } from "@tanstack/react-query";

import { Shipment } from "@/types/shipment";

async function fetchShipment(id: string): Promise<Shipment> {
  const res = await fetch(`/api/shipments/${id}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải vận đơn");
  }
  return data;
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ["shipments", id],
    queryFn: () => fetchShipment(id),
    enabled: !!id,
  });
}
