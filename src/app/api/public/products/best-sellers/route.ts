import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  const limit = req.nextUrl.searchParams.get("limit");
  const search = req.nextUrl.searchParams.get("search");
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/public/products/best-sellers`,
  );
  if (page) url.searchParams.set("page", page);
  if (limit) url.searchParams.set("limit", limit);
  if (search) url.searchParams.set("search", search);
  if (categoryId) url.searchParams.set("categoryId", categoryId);

  const res = await fetch(url, { method: "GET" });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
