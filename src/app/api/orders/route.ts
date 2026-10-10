import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
  return proxyBackend("/orders", request);
}

export async function POST(req: NextRequest) {
  return proxyBackend("/orders", req);
}
