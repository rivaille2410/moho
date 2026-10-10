import { type NextRequest } from "next/server";
import { proxyPublicApiGet } from "@/lib/public-api";

export async function GET(request: NextRequest) {
  return proxyPublicApiGet(request, "/public/products/best-sellers");
}
