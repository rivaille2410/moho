import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tiêu đề")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),

  excerpt: z
    .string()
    .trim()
    .max(300, "Mô tả ngắn không được vượt quá 300 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  thumbnailUrl: z
    .string()
    .trim()
    .url("URL ảnh đại diện không hợp lệ")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  content: z.string().trim().min(1, "Vui lòng nhập nội dung bài viết"),

  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function buildDefaultPostValues(): CreatePostFormValues {
  return {
    title: "",
    excerpt: "",
    thumbnailUrl: "",
    content: "",
    status: "DRAFT",
  };
}

export const postDetailSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tiêu đề")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),

  excerpt: z
    .string()
    .trim()
    .max(300, "Mô tả ngắn không được vượt quá 300 ký tự")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  thumbnailUrl: z
    .string()
    .trim()
    .url("URL ảnh đại diện không hợp lệ")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  content: z.string().trim().min(1, "Vui lòng nhập nội dung bài viết"),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type PostDetailFormValues = z.infer<typeof postDetailSchema>;

export function buildDefaultPostDetailValues(
  post?: Partial<PostDetailFormValues>,
): PostDetailFormValues {
  return {
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    thumbnailUrl: post?.thumbnailUrl ?? "",
    content: post?.content ?? "",
    status: post?.status ?? "DRAFT",
  };
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
