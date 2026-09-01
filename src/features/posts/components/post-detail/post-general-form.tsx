"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { ImageIcon, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  postDetailSchema,
  type PostDetailFormValues,
  buildDefaultPostDetailValues,
} from "@/schemas/post";
import { type Post } from "@/types/post";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import { useUpdatePost } from "@/features/posts/hooks/use-update-post";
import { useUploadImage } from "@/features/media/hooks/use-upload-image";

function toDefaultValues(post: Post): PostDetailFormValues {
  return buildDefaultPostDetailValues({
    title: post.title,
    excerpt: post.excerpt ?? "",
    thumbnailUrl: post.thumbnailUrl ?? "",
    content: post.content,
    status: post.status,
  });
}

interface Props {
  post: Post;
}

export function PostGeneralForm({ post }: Props) {
  const updatePost = useUpdatePost();
  const uploadImage = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostDetailFormValues>({
    resolver: zodResolver(postDetailSchema),
    defaultValues: toDefaultValues(post),
  });

  useEffect(() => {
    form.reset(toDefaultValues(post));
  }, [post.id, post.updatedAt]);

  const thumbnailUrl = form.watch("thumbnailUrl");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImage.mutate(file, {
      onSuccess: (data) => {
        form.setValue("thumbnailUrl", data.url, { shouldValidate: true });
      },
    });

    e.target.value = "";
  };

  const onSubmit = (values: PostDetailFormValues) => {
    updatePost.mutate({
      id: post.id,
      payload: {
        ...values,
        excerpt: values.excerpt || undefined,
        thumbnailUrl: values.thumbnailUrl || undefined,
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tiêu đề</FieldLabel>
          <Input
            placeholder="Nhập tiêu đề bài viết"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <FieldError>{form.formState.errors.title.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Ảnh đại diện — không bắt buộc</FieldLabel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative aspect-video w-full max-w-sm shrink-0 overflow-hidden rounded-lg border bg-muted">
              {uploadImage.isPending ? (
                <div className="flex size-full items-center justify-center">
                  <Spinner className="size-6 text-secondary" />
                </div>
              ) : thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt="Xem trước ảnh đại diện"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <ImageIcon className="size-6" />
                  <span className="text-xs">Chưa có ảnh</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadImage.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {thumbnailUrl ? "Đổi ảnh" : "Tải ảnh lên"}
              </Button>
              <FieldDescription>
                Chọn ảnh đại diện cho bài viết (JPG, PNG...). Tỷ lệ 16:9 hiển
                thị đẹp nhất.
              </FieldDescription>
              {form.formState.errors.thumbnailUrl && (
                <FieldError>
                  {form.formState.errors.thumbnailUrl.message}
                </FieldError>
              )}
            </div>
          </div>
        </Field>

        <Field>
          <FieldLabel>Mô tả ngắn — không bắt buộc</FieldLabel>
          <Textarea
            rows={2}
            placeholder="Tóm tắt ngắn gọn nội dung bài viết"
            {...form.register("excerpt")}
          />
          {form.formState.errors.excerpt && (
            <FieldError>{form.formState.errors.excerpt.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Nội dung</FieldLabel>
          <RichTextEditor
            value={form.watch("content") ?? ""}
            onChange={(html) =>
              form.setValue("content", html, { shouldValidate: true })
            }
            placeholder="Nhập nội dung bài viết..."
          />
          {form.formState.errors.content && (
            <FieldError>{form.formState.errors.content.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updatePost.isPending}>
          {updatePost.isPending && <Spinner className="size-4" />}
          {updatePost.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
