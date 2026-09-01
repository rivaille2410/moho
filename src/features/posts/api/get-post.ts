import { type Post } from "@/types/post";

export async function getPost(
  id: string,
  options?: { baseUrl?: string; cookie?: string },
): Promise<Post> {
  const url = `${options?.baseUrl ?? ""}/api/posts/${id}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: options?.cookie ? { cookie: options.cookie } : undefined,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}
