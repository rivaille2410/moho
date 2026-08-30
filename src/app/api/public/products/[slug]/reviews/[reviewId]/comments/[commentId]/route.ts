import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ slug: string; reviewId: string; commentId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { slug, reviewId, commentId } = await params;

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${slug}/reviews/${reviewId}/comments/${commentId}`,
    { method: "DELETE" },
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
