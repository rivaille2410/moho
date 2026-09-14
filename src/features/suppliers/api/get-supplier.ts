import { Supplier } from "@/types/supplier";

interface GetSupplierOptions {
  baseUrl: string;
  cookie?: string;
}

export async function getSupplier(
  id: string,
  { baseUrl, cookie }: GetSupplierOptions,
): Promise<Supplier> {
  const res = await fetch(`${baseUrl}/api/suppliers/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải nhà cung cấp");
  }

  return res.json();
}
