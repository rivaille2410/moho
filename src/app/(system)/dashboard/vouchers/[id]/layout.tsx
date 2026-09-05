import type { Metadata } from "next";
import { headers } from "next/headers";

import { getVoucher } from "@/features/vouchers/api/get-voucher";

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
    const voucher = await getVoucher(id, { baseUrl, cookie });

    return {
      title: `${voucher.code} | MOHO Admin`,
      description: `Chi tiết và cấu hình voucher ${voucher.code} - ${voucher.name}.`,
    };
  } catch {
    return {
      title: "Chi tiết voucher | MOHO Admin",
      description: "Xem và chỉnh sửa thông tin chi tiết voucher.",
    };
  }
}

export default async function VoucherDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
