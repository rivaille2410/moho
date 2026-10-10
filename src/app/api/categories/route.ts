import { type NextRequest } from "next/server";
import { proxyBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
  return proxyBackend("/categories", request);
}

export async function POST(request: NextRequest) {
  return proxyBackend("/categories", request);
}
