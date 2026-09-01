import Link from "next/link";
import Image from "next/image";

import { Eye, ImageOff } from "lucide-react";

import { PostListItem } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: PostListItem }) {
  const publishedLabel = formatDate(post.publishedAt);

  return (
    <Link href={`/posts/${post.slug}`} className="group flex flex-col">
      <div className="relative mb-3 aspect-video overflow-hidden rounded-md bg-muted">
        {post.thumbnailUrl ? (
          <Image
            fill
            src={post.thumbnailUrl}
            alt={post.title}
            className="object-cover"
            sizes="(min-width: 1536px) 16vw, (min-width: 768px) 20vw, 50vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" />
          </div>
        )}
      </div>

      <p className="mb-1.5 min-h-9.5 text-sm sm:text-base font-semibold leading-snug text-foreground group-hover:text-secondary transition line-clamp-2">
        {post.title}
      </p>

      {post.excerpt && (
        <p className="mb-2 text-[13px] text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] text-muted-foreground">
        <span>{publishedLabel ?? "Bản nháp"}</span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {post.viewCount}
        </span>
      </div>
    </Link>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-3 aspect-video rounded-md" />
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="mb-1 h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
