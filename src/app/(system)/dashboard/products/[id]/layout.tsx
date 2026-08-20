import type { Metadata } from "next";
import { headers } from "next/headers";

import { getProduct } from "@/features/products/api/get-product";

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
    const product = await getProduct(id, { baseUrl, cookie });

    return {
      title: `${product.name} | MOHO Admin`,
      description: `Chi tiết, biến thể và hình ảnh của sản phẩm ${product.name}.`,
    };
  } catch {
    return {
      title: "Chi tiết sản phẩm | MOHO Admin",
      description: "Xem và chỉnh sửa thông tin chi tiết sản phẩm.",
    };
  }
}

export default async function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
