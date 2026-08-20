import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

interface RouteParams {
  params: Promise<{ id: string; variantId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id, variantId } = await params;
  const body = await req.json();

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${id}/variants/${variantId}`,
    {
      method: "PATCH",
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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id, variantId } = await params;

  const { res, unauthorized } = await fetchWithAuth(
    `/products/${id}/variants/${variantId}`,
    { method: "DELETE" },
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
