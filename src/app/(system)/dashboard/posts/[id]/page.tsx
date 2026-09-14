"use client";

import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/features/posts/hooks/use-post";
import { useBreadcrumbLabel } from "@/lib/breadcrumb-store";

import { PostGeneralForm } from "@/features/posts/components/post-detail/post-general-form";
import { PostDetailHeader } from "@/features/posts/components/post-detail/post-detail-header";

function PostDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1.5">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-72" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Skeleton className="aspect-video w-full max-w-sm shrink-0 rounded-lg" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-3 w-full max-w-sm" />
              <Skeleton className="h-3 w-2/3 max-w-sm" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-16 w-full" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-48 w-full" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: post, isLoading, isError } = usePost(params.id);

  useBreadcrumbLabel(pathname, post?.title, isLoading);

  if (isLoading) {
    return <PostDetailSkeleton />;
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
