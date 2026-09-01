"use client";

import Link from "next/link";

import { ArrowLeft, Eye, CalendarCheck } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import { type Post, type PostStatus } from "@/types/post";
import { useUpdatePostStatus } from "@/features/posts/hooks/use-update-post-status";

const statusItems: { label: string; value: PostStatus }[] = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã đăng", value: "PUBLISHED" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface Props {
  post: Post;
}

export function PostDetailHeader({ post }: Props) {
  const updateStatus = useUpdatePostStatus();

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/posts"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách bài viết
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>/{post.slug}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {post.viewCount} lượt xem
            </span>
            <span className="flex items-center gap-1">
              <CalendarCheck className="size-3.5" />
              Đăng {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>

        <Select
          items={statusItems}
          value={post.status}
          onValueChange={(value) =>
            value &&
            updateStatus.mutate({
              id: post.id,
              status: value as PostStatus,
            })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
