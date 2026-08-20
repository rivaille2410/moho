"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { ImagePlus, Trash2Icon, Star, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProductImage, ProductListItem } from "@/types/product";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

import { useAddProductImage } from "@/features/products/hooks/use-add-product-image";
import { useRemoveProductImage } from "@/features/products/hooks/use-remove-product-image";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const GENERAL_TARGET = "__general__";

interface Props {
  product: ProductListItem;
}

function ImageGrid({
  images,
  isUploading,
  onDelete,
  onAddClick,
}: {
  images: ProductImage[];
  isUploading: boolean;
  onDelete: (image: ProductImage) => void;
  onAddClick: () => void;
}) {
  if (images.length === 0) {
    return (
      <div
        role="button"
        tabIndex={isUploading ? -1 : 0}
        aria-disabled={isUploading}
        onClick={() => {
          if (isUploading) return;
          onAddClick();
        }}
        onKeyDown={(e) => {
          if (isUploading) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAddClick();
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center transition-colors",
          isUploading
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:bg-muted/50",
        )}
      >
        {isUploading ? (
          <>
            <Spinner className="size-6 text-secondary" />
            <p className="text-sm text-muted-foreground">Đang tải ảnh lên...</p>
          </>
        ) : (
          <>
            <ImageOff className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Chưa có ảnh nào</p>
            <p className="text-xs text-muted-foreground">Bấm để tải ảnh lên</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
          <Image
            src={image.url}
            alt=""
            fill
            sizes="180px"
            className="object-cover"
          />

          {image.isThumbnail && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
              <Star className="size-2.5 fill-current" />
              Đại diện
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <Button
              size="icon-lg"
              variant="destructive"
              disabled={isUploading}
              onClick={() => onDelete(image)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductImagesSection({ product }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>(GENERAL_TARGET);
  const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);

  const addImage = useAddProductImage();
  const removeImage = useRemoveProductImage();

  const groups = [
    { label: "Ảnh chung", value: GENERAL_TARGET, images: product.images },
    ...product.variants.map((v) => ({
      label: v.name,
      value: v.id,
      images: v.images,
    })),
  ];

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) {
      e.target.value = "";
      return;
    }

    const files = Array.from(fileList);
    e.target.value = "";

    if (files.length > MAX_FILES) {
      toast.add({
        type: "error",
        description: `Chỉ được tải lên tối đa ${MAX_FILES} ảnh mỗi lần`,
      });
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.add({
          type: "error",
          description: `"${file.name}": chỉ chấp nhận ảnh JPG, PNG hoặc WEBP`,
        });
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.add({
          type: "error",
          description: `"${file.name}": ảnh không được vượt quá 5MB`,
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    addImage.mutate({
      productId: product.id,
      files: validFiles,
      variantId: activeTab === GENERAL_TARGET ? undefined : activeTab,
    });
  };

  const handleConfirmDelete = () => {
    if (!imageToDelete) return;
    removeImage.mutate(
      { productId: product.id, imageId: imageToDelete.id },
      { onSuccess: () => setImageToDelete(null) },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            {groups.map((group) => (
              <TabsTrigger key={group.value} value={group.value}>
                {group.label}
                <span className={cn("ml-1.5 text-xs", "text-muted-foreground")}>
                  {group.images.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button
            size="lg"
            disabled={addImage.isPending}
            onClick={handleButtonClick}
          >
            {addImage.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {addImage.isPending ? "Đang tải lên..." : "Tải ảnh lên"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value} className="pt-4">
            <ImageGrid
              images={group.images}
              onDelete={setImageToDelete}
              onAddClick={handleButtonClick}
              isUploading={addImage.isPending}
            />
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmActionDialog
        confirmLabel="Xoá"
        title="Xoá ảnh này?"
        icon={<Trash2Icon />}
        variant="destructive"
        open={!!imageToDelete}
        pendingLabel="Đang xoá..."
        onConfirm={handleConfirmDelete}
        isPending={removeImage.isPending}
        onOpenChange={(open) => !open && setImageToDelete(null)}
        description="Ảnh sẽ bị xoá khỏi sản phẩm và không thể khôi phục."
      />
    </div>
  );
}
