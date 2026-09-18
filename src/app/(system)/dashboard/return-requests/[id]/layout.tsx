import type { Metadata } from "next";
import { headers } from "next/headers";

import { getReturnRequest } from "@/features/return-requests/api/get-return-request";

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
    const returnRequest = await getReturnRequest(id, { baseUrl, cookie });

    return {
      title: `${returnRequest.code} | MOHO Admin`,
      description: `Chi tiết yêu cầu trả hàng ${returnRequest.code} của đơn ${returnRequest.orderNumber}.`,
    };
  } catch {
    return {
      title: "Chi tiết yêu cầu trả hàng | MOHO Admin",
      description: "Xem và xử lý yêu cầu trả hàng.",
    };
  }
}

export default async function ReturnRequestDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
