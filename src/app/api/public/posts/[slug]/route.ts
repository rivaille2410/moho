import { type NextRequest } from "next/server";
import { proxyPublicApiGet } from "@/lib/public-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyPublicApiGet(
    request,
    `/public/posts/${encodeURIComponent(slug)}`,
  );
}
