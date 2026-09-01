"use client";

import { useParams, usePathname } from "next/navigation";

import { usePost } from "@/features/posts/hooks/use-post";
import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";

import { Spinner } from "@/components/ui/spinner";

import { PostGeneralForm } from "@/features/posts/components/post-detail/post-general-form";
import { PostDetailHeader } from "@/features/posts/components/post-detail/post-detail-header";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: post, isLoading, isError } = usePost(params.id);

  useBreadcrumbLabel(pathname, post?.title, isLoading);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8 text-secondary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">Không tìm thấy bài viết</p>
        <p className="text-sm text-muted-foreground">
          Bài viết có thể đã bị xoá hoặc đường dẫn không đúng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6 overflow-y-auto">
      <PostDetailHeader post={post} />
      <PostGeneralForm post={post} />
    </div>
  );
}
