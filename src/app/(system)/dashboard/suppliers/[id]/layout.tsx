import type { Metadata } from "next";
import { headers } from "next/headers";

import { getSupplier } from "@/features/suppliers/api/get-supplier";

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
    const supplier = await getSupplier(id, { baseUrl, cookie });

    return {
      title: `${supplier.name} | MOHO Admin`,
      description: `Chi tiết thông tin nhà cung cấp ${supplier.name}.`,
    };
  } catch {
    return {
      title: "Chi tiết nhà cung cấp | MOHO Admin",
      description: "Xem và chỉnh sửa thông tin chi tiết nhà cung cấp.",
    };
  }
}

export default async function SupplierDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
