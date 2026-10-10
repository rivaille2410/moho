import { NextRequest, NextResponse } from "next/server";
import { getBackendApiBaseUrl, withBackendTimeout } from "@/lib/backend-api";

export async function fetchPublicApi<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T> {
  const baseUrl = getBackendApiBaseUrl();
  const hasRevalidation = options.revalidate !== undefined;
  const response = await fetch(`${baseUrl}${path}`, {
    ...(hasRevalidation
      ? {
          next: {
            revalidate: options.revalidate,
            tags: options.tags,
          },
        }
      : {
          ...withBackendTimeout({ cache: "no-store" as const }),
        }),
  });

  if (!response.ok) {
    throw new Error(`Public API returned ${response.status} for ${path}`);
  }

  return response.json() as Promise<T>;
}

/** Proxy a read-only public API request and normalize cold-start/network failures. */
export async function proxyPublicApiGet(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  let baseUrl: string;
  try {
    baseUrl = getBackendApiBaseUrl();
  } catch {
    return NextResponse.json(
      { message: "Public API is not configured", code: "API_NOT_CONFIGURED" },
      { status: 500 },
    );
  }

  const { search } = new URL(request.url);
  const path = `${backendPath}${search}`;

  try {
    const response = await fetch(
      `${baseUrl}${path}`,
      withBackendTimeout({ method: "GET", cache: "no-store" }, request.signal),
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);
    const retryAfter = response.headers.get("retry-after");
    return NextResponse.json(data, {
      status: response.status,
      headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        message: timedOut
          ? "The public API is taking longer than expected to start."
          : "The public API is temporarily unavailable.",
        code: timedOut ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNAVAILABLE",
      },
      { status: 503, headers: { "Retry-After": "5" } },
    );
  }
}
