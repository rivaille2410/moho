import { NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function POST(req: NextRequest) {
  return proxyBackend("/vouchers/validate", req);
}
