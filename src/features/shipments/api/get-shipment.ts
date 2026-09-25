import { Shipment } from "@/types/shipment";

interface GetShipmentOptions {
  baseUrl: string;
  cookie?: string;
}

export async function getShipment(
  id: string,
  { baseUrl, cookie }: GetShipmentOptions,
): Promise<Shipment> {
  const res = await fetch(`${baseUrl}/api/shipments/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải vận đơn");
  }

  return res.json();
}
