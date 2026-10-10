import { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function DELETE(req: NextRequest) {
  return proxyBackend("/vouchers/bulk", req);
}
