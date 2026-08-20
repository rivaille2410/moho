import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { search } = new URL(request.url);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/products${search}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
