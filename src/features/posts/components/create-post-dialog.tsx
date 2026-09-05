"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Type, Upload, ImageIcon } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import {
  createPostSchema,
  CreatePostFormValues,
  buildDefaultPostValues,
} from "@/schemas/post";
import { useCreatePost } from "@/features/posts/hooks/use-create-post";
import { useUploadImage } from "@/features/media/hooks/use-upload-image";

const statusItems = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đăng ngay", value: "PUBLISHED" },
];

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useCreatePost();
  const uploadImage = useUploadImage();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: buildDefaultPostValues(),
  });

  const thumbnailUrl = form.watch("thumbnailUrl");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildDefaultPostValues());
    } else {
      createPost.reset();
    }
  };

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

  const onSubmit = (values: CreatePostFormValues) => {
    createPost.mutate(
      {
        ...values,
        excerpt: values.excerpt || undefined,
        thumbnailUrl: values.thumbnailUrl || undefined,
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            <span className="hidden xl:inline">Thêm bài viết</span>
          </Button>
        }
      />

      <DialogContent className="w-[95vw] min-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bài viết mới</DialogTitle>
          <DialogDescription>
            Sau khi tạo, bạn có thể chỉnh sửa chi tiết ở trang bài viết.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Tiêu đề</FieldLabel>
              <Input
                startIcon={<Type />}
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
                    Chọn ảnh đại diện cho bài viết. Tỷ lệ 16:9 hiển thị đẹp
                    nhất.
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
              <FieldDescription>
                Hiển thị ở danh sách bài viết và trang chủ.
              </FieldDescription>
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

            <Field>
              <FieldLabel>Trạng thái</FieldLabel>
              <Select
                items={statusItems}
                value={form.watch("status")}
                onValueChange={(value: string | null) =>
                  form.setValue(
                    "status",
                    (value ?? "DRAFT") as "DRAFT" | "PUBLISHED",
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button size={"lg"} type="submit" disabled={createPost.isPending}>
              {createPost.isPending && <Spinner className="size-4" />}
              {createPost.isPending ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
