import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id, imageId } = await params;

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${id}/images/${imageId}`,
    { method: "DELETE" },
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
