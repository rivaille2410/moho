import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { search } = new URL(req.url);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/reviews${search}`,
    { method: "GET" },
  );

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const body = await req.json();

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${slug}/reviews`,
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
