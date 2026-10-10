import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyBackend(`/vouchers/${id}/status`, req);
}
