import type { Metadata } from "next";
import { headers } from "next/headers";

import { getShipment } from "@/features/shipments/api/get-shipment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie") ?? undefined;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const shipment = await getShipment(id, { baseUrl, cookie });

    return {
      title: `${shipment.code} | MOHO Admin`,
      description: `Chi tiết vận đơn ${shipment.code} của đơn hàng ${shipment.order.orderNumber}.`,
    };
  } catch {
    return {
      title: "Chi tiết vận đơn | MOHO Admin",
      description: "Xem và cập nhật thông tin chi tiết vận đơn.",
    };
  }
}

export default async function ShipmentDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
