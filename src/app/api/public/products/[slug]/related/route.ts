import { NextRequest } from "next/server";
import { proxyPublicApiGet } from "@/lib/public-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  return proxyPublicApiGet(
    req,
    `/public/products/${encodeURIComponent(slug)}/related`,
  );
}
