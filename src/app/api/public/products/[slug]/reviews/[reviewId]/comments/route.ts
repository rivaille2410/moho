import { NextRequest, NextResponse } from "next/server";

import { fetchOptionalAuth, fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ slug: string; reviewId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug, reviewId } = await params;
  const search = req.nextUrl.searchParams.toString();

  const res = await fetchOptionalAuth(
    `/products/${slug}/reviews/${reviewId}/comments${
      search ? `?${search}` : ""
    }`,
  );

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug, reviewId } = await params;
  const body = await req.json().catch(() => ({}));

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${slug}/reviews/${reviewId}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
