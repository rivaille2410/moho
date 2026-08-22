import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/reviews/summary`,
    { method: "GET" },
  );

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
