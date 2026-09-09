import type { Metadata } from "next";
import { headers } from "next/headers";

async function getOrderForMetadata(
  id: string,
  { baseUrl, cookie }: { baseUrl: string; cookie?: string },
) {
  const res = await fetch(`${baseUrl}/api/orders/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải thông tin đơn hàng");
  }
  return data;
}

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
    const order = await getOrderForMetadata(id, { baseUrl, cookie });

    return {
      title: `Đơn hàng ${order.orderNumber} | MOHO Admin`,
      description: `Chi tiết đơn hàng ${order.orderNumber} của khách hàng ${order.recipientName}.`,
    };
  } catch {
    return {
      title: "Chi tiết đơn hàng | MOHO Admin",
      description: "Xem và quản lý thông tin chi tiết đơn hàng.",
    };
  }
}

export default async function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
