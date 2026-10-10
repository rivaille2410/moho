import { type Post } from "@/types/post";
import { fetchPublicApi } from "@/lib/public-api";

interface FetchOptions {
  baseUrl?: string;
  cookie?: string;
  apiBaseUrl?: string;
  revalidateSeconds?: number;
}

export async function getPublicPostBySlug(
  slug: string,
  options?: FetchOptions,
): Promise<Post> {
  const path = `/public/posts/${encodeURIComponent(slug)}`;
  if (options?.apiBaseUrl && options.revalidateSeconds) {
    return fetchPublicApi<Post>(path, {
      revalidate: options.revalidateSeconds,
      tags: ["public-posts"],
    });
  }

  const url = options?.apiBaseUrl
    ? `${options.apiBaseUrl.replace(/\/$/, "")}${path}`
    : options?.baseUrl
      ? `${options.baseUrl}/api${path}`
      : `/api${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: options?.cookie ? { cookie: options.cookie } : undefined,
    ...(options?.revalidateSeconds
      ? {
          next: {
            revalidate: options.revalidateSeconds,
            tags: ["public-posts"],
          },
        }
      : { cache: "no-store" as const }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch public post");
  }

  return res.json();
}
