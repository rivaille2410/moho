import type { Metadata } from "next";
import { headers } from "next/headers";

import { getPublicProductBySlug } from "@/features/products/api/get-public-product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host");
  const cookie = headersList.get("cookie") ?? undefined;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const product = await getPublicProductBySlug(slug, { baseUrl, cookie });
    const description =
      product.description ?? `Mua ${product.name} chính hãng tại MOHO.`;
    const image = product.images[0]?.url;

    return {
      title: `${product.name} | MOHO`,
      description,
      openGraph: {
        title: product.name,
        description,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return {
      title: "Sản phẩm | MOHO",
      description: "Nội thất gỗ chất lượng cao từ MOHO.",
    };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
