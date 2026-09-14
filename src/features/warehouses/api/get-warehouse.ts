import { Warehouse } from "@/types/warehouse";

interface GetWarehouseOptions {
  baseUrl: string;
  cookie?: string;
}

export async function getWarehouse(
  id: string,
  { baseUrl, cookie }: GetWarehouseOptions,
): Promise<Warehouse> {
  const res = await fetch(`${baseUrl}/api/warehouses/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải kho hàng");
  }

  return res.json();
}
