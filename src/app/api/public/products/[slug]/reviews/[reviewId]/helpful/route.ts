import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ slug: string; reviewId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug, reviewId } = await params;

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${slug}/reviews/${reviewId}/helpful`,
    { method: "POST" },
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
