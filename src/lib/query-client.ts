import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "./api-error";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Do not retry client errors (4xx)
          if (isApiError(error) && error.isClientError) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function shouldRetryPublicQuery(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= 5) return false;

  if (isApiError(error)) {
    if (error.code === "UPSTREAM_TIMEOUT") return false;
    return (
      error.status === 408 ||
      error.status === 425 ||
      error.status === 429 ||
      error.isServerError
    );
  }

  return error instanceof TypeError;
}

export function publicQueryRetryDelay(
  attemptIndex: number,
  error: unknown,
): number {
  if (isApiError(error) && error.retryAfterMs !== undefined) {
    return Math.min(error.retryAfterMs, 15_000);
  }

  return Math.min(1000 * 2 ** attemptIndex, 10_000);
}
