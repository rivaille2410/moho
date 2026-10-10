import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
  return proxyBackend("/products", request);
}

export async function POST(req: NextRequest) {
  return proxyBackend("/products", req);
}
