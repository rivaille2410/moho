import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth, fetchOptionalAuth } from "./auth-fetch";

export interface ProxyBackendOptions {
  optionalAuth?: boolean;
  overrideMethod?: string;
}

/**
 * Forwards an incoming Next.js API Route Handler request to the NestJS backend
 * handling authentication cookies, token refreshes, query strings, and body serialization.
 */
export async function proxyBackend(
  backendPath: string,
  request?: NextRequest,
  options: ProxyBackendOptions = {},
): Promise<NextResponse | Response> {
  const method = options.overrideMethod ?? request?.method ?? "GET";
  let body: BodyInit | undefined = undefined;

  if (request && ["POST", "PUT", "PATCH"].includes(method)) {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else if (contentType.includes("application/json")) {
      const json = await request.json().catch(() => null);
      if (json !== null) {
        body = JSON.stringify(json);
      }
    } else {
      const text = await request.text().catch(() => "");
      if (text) {
        body = text;
      }
    }
  }

  // Append query string if present and not already part of backendPath
  let targetPath = backendPath;
  if (request) {
    const { search } = new URL(request.url);
    if (search && !targetPath.includes("?")) {
      targetPath = `${backendPath}${search}`;
    }
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData && body !== undefined ? { "Content-Type": "application/json" } : {}),
  };

  if (options.optionalAuth) {
    const res = await fetchOptionalAuth(targetPath, {
      method,
      headers,
      body,
    });

    if (!res) {
      return NextResponse.json({ message: "Request failed" }, { status: 500 });
    }

    if (res.status === 204) {
      return new Response(null, { status: 204 });
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  }

  const { res, unauthorized } = await fetchWithAuth(targetPath, {
    method,
    headers,
    body,
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (res.status === 204) {
    return new Response(null, { status: 204 });
  }

  const contentType = res.headers.get("content-type") ?? "";
  const disposition = res.headers.get("content-disposition");

  if (disposition || contentType.includes("sheet") || contentType.includes("octet-stream") || contentType.includes("pdf")) {
    return new Response(res.body, {
      status: res.status,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        ...(disposition ? { "Content-Disposition": disposition } : {}),
      },
    });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
