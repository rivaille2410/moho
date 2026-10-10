import { ApiError } from "./api-error";
import { getErrorMessage } from "@/constants/error-messages";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | null | undefined | (string | number | boolean)[]>;
}

export function buildQueryString(
  params?: Record<string, string | number | boolean | null | undefined | (string | number | boolean)[]>,
): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    let errorData: { message?: string; code?: string; errors?: Record<string, string[]> } = {};

    if (isJson) {
      errorData = await res.json().catch(() => ({}));
    } else {
      const text = await res.text().catch(() => "");
      errorData = { message: text };
    }

    const translatedMessage = getErrorMessage(errorData, "Có lỗi xảy ra trong quá trình xử lý.");

    const retryAfterHeader = res.headers.get("retry-after");
    const retryAfterSeconds = retryAfterHeader
      ? Number(retryAfterHeader)
      : Number.NaN;
    const retryAfterDate = retryAfterHeader
      ? Date.parse(retryAfterHeader)
      : Number.NaN;
    const retryAfterMs = Number.isFinite(retryAfterSeconds)
      ? Math.max(0, retryAfterSeconds * 1000)
      : Number.isFinite(retryAfterDate)
        ? Math.max(0, retryAfterDate - Date.now())
        : undefined;

    throw new ApiError(
      res.status,
      translatedMessage,
      errorData.code,
      errorData.errors,
      retryAfterMs,
    );
  }

  if (isJson) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}

export async function request<T>(
  url: string,
  method: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers = {}, ...rest } = options;
  const fullUrl = `${url}${buildQueryString(params)}`;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: HeadersInit = {
    ...(!isFormData && body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  const res = await fetch(fullUrl, {
    method,
    headers: requestHeaders,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  return handleResponse<T>(res);
}

export const apiClient = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>(url, "GET", undefined, options);
  },

  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, "POST", body, options);
  },

  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, "PUT", body, options);
  },

  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, "PATCH", body, options);
  },

  delete<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(url, "DELETE", body, options);
  },
};
