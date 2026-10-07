"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { ImagePlus, Trash2Icon, Star, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProductImage, ProductListItem } from "@/types/product";

import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

import { useAddProductImage } from "@/features/products/hooks/use-add-product-image";
import { useRemoveProductImage } from "@/features/products/hooks/use-remove-product-image";
import { useRemoveProductImages } from "@/features/products/hooks/use-remove-product-images";
import { useSetProductThumbnail } from "@/features/products/hooks/use-set-product-thumbnail";

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
  isBusy,
  selectedIds,
  isThumbnailEnabled,
  onToggleSelect,
  onDelete,
  onSetThumbnail,
  onAddClick,
}: {
  images: ProductImage[];
  isUploading: boolean;
  isBusy: boolean;
  selectedIds: string[];
  isThumbnailEnabled: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (image: ProductImage) => void;
  onSetThumbnail: (image: ProductImage) => void;
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
      {images.map((image) => {
        const selected = selectedIds.includes(image.id);
        const showThumbnailBadge = isThumbnailEnabled && image.isThumbnail;
        const canSetThumbnail = isThumbnailEnabled && !image.isThumbnail;

        return (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
              selected &&
                "ring-3 ring-secondary/40 border-secondary ring-offset-1",
            )}
          >
            <Image
              src={image.url}
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />

            {showThumbnailBadge && (
              <Badge
                variant={"secondary"}
                className="absolute left-1.5 top-1.5 text-xs"
              >
                <Star className="size-2.5 fill-current" />
                Đại diện
              </Badge>
            )}

            <div
              className={cn(
                "absolute right-1.5 top-1.5 z-10 bg-background rounded-md transition-opacity",
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              <Checkbox
                checked={selected}
                disabled={isBusy}
                onCheckedChange={() => onToggleSelect(image.id)}
                aria-label="Chọn ảnh"
                className="size-4.5 data-checked:bg-secondary data-checked:border-secondary"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              {canSetThumbnail && (
                <Button
                  size="icon-lg"
                  variant="secondary"
                  title="Đặt làm ảnh đại diện"
                  disabled={isBusy}
                  onClick={() => onSetThumbnail(image)}
                >
                  <Star />
                </Button>
              )}
              <Button
                size="icon-lg"
                variant="destructive"
                title="Xoá ảnh"
                disabled={isBusy}
                className="text-muted bg-destructive hover:bg-destructive"
                onClick={() => onDelete(image)}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProductImagesSection({ product }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>(GENERAL_TARGET);
  const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const addImage = useAddProductImage();
  const removeImage = useRemoveProductImage();
  const removeImages = useRemoveProductImages();
  const setThumbnail = useSetProductThumbnail();

  const isBusy =
    addImage.isPending ||
    removeImage.isPending ||
    removeImages.isPending ||
    setThumbnail.isPending;

  const groups = [
    { label: "Ảnh chung", value: GENERAL_TARGET, images: product.images },
    ...product.variants.map((v) => ({
      label: v.name,
      value: v.id,
      images: v.images,
    })),
  ];

  const activeGroup = groups.find((g) => g.value === activeTab) ?? groups[0];
  const selectedInActive = activeGroup.images
    .filter((image) => selectedIds.includes(image.id))
    .map((image) => image.id);
  const allSelected =
    activeGroup.images.length > 0 &&
    selectedInActive.length === activeGroup.images.length;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : activeGroup.images.map((i) => i.id));
  };

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
    const deletedId = imageToDelete.id;
    removeImage.mutate(
      { productId: product.id, imageId: deletedId },
      {
        onSuccess: () => {
          setImageToDelete(null);
          setSelectedIds((prev) => prev.filter((id) => id !== deletedId));
        },
      },
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedInActive.length === 0) return;
    removeImages.mutate(
      { productId: product.id, imageIds: selectedInActive },
      {
        onSuccess: () => {
          setConfirmBulkDelete(false);
          setSelectedIds([]);
        },
      },
    );
  };

  const handleSetThumbnail = (image: ProductImage) => {
    setThumbnail.mutate({ productId: product.id, imageId: image.id });
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            {groups.map((group) => (
              <TabsTrigger key={group.value} value={group.value}>
                {group.label}
                <span className={cn("text-xs", "text-muted-foreground")}>
                  ({group.images.length})
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
            {group.images.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={allSelected}
                    disabled={isBusy}
                    onCheckedChange={toggleSelectAll}
                  />
                  Chọn tất cả
                  {selectedInActive.length > 0 && (
                    <span className="text-muted-foreground">
                      (đã chọn {selectedInActive.length})
                    </span>
                  )}
                </label>

                {selectedInActive.length > 0 && (
                  <Button
                    variant="destructive"
                    disabled={isBusy}
                    onClick={() => setConfirmBulkDelete(true)}
                  >
                    <Trash2Icon className="size-4" />
                    Xóa đã chọn ({selectedInActive.length})
                  </Button>
                )}
              </div>
            )}

            <ImageGrid
              images={group.images}
              selectedIds={selectedIds}
              isThumbnailEnabled={group.value === GENERAL_TARGET}
              onToggleSelect={toggleSelect}
              onDelete={setImageToDelete}
              onSetThumbnail={handleSetThumbnail}
              onAddClick={handleButtonClick}
              isUploading={addImage.isPending}
              isBusy={isBusy}
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

      <ConfirmActionDialog
        confirmLabel="Xoá"
        title={`Xoá ${selectedInActive.length} ảnh đã chọn?`}
        icon={<Trash2Icon />}
        variant="destructive"
        open={confirmBulkDelete}
        pendingLabel="Đang xoá..."
        onConfirm={handleConfirmBulkDelete}
        isPending={removeImages.isPending}
        onOpenChange={(open) => !open && setConfirmBulkDelete(false)}
        description="Các ảnh sẽ bị xoá khỏi sản phẩm và không thể khôi phục."
      />
    </div>
  );
}
