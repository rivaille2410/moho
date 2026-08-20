import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = req.nextUrl.searchParams.get("limit");

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/public/products/${slug}/related`,
  );
  if (cursor) url.searchParams.set("cursor", cursor);
  if (limit) url.searchParams.set("limit", limit);

  const res = await fetch(url, { method: "GET" });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
