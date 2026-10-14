import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  return proxyBackend("/shipping/calculate", request);
}
