import type { Metadata } from "next";
import { headers } from "next/headers";

import { getWarehouse } from "@/features/warehouses/api/get-warehouse";

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
    const warehouse = await getWarehouse(id, { baseUrl, cookie });

    return {
      title: `${warehouse.name} | MOHO Admin`,
      description: `Chi tiết thông tin kho hàng ${warehouse.name}.`,
    };
  } catch {
    return {
      title: "Chi tiết kho hàng | MOHO Admin",
      description: "Xem và chỉnh sửa thông tin chi tiết kho hàng.",
    };
  }
}

export default async function WarehouseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
