import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyBackend(`/products/${id}/status`, req);
}
