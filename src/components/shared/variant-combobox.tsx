"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import type {
  ProductImage,
  ProductListItem,
  ProductVariant,
} from "@/types/product";
import { cn } from "@/lib/utils";
import { useInfiniteProducts } from "@/features/products/hooks/use-infinite-products";

export interface VariantSelection {
  productId: string;
  variantId: string | null;
  variantLabel: string;
  unitCost: number;
  stock: number;
  imageUrl?: string;
}

interface VariantComboboxProps {
  value?: string;
  valueLabel?: string;
  onSelect: (option: VariantSelection) => void;
  placeholder?: string;
  disabled?: boolean;
  allowOutOfStock?: boolean;
}

function resolveUnitCost(product: ProductListItem, variant: ProductVariant) {
  return variant.priceOverride ?? product.price;
}

function pickImage(images?: ProductImage[]) {
  if (!images?.length) return undefined;
  return (images.find((i) => i.isThumbnail) ?? images[0]).url;
}

function getImageUrl(product: ProductListItem, variant?: ProductVariant) {
  return pickImage(variant?.images) ?? pickImage(product.images);
}

function optimize(url?: string) {
  return url?.replace("/upload/", "/upload/w_80,h_80,c_fill,f_auto,q_auto/");
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  return src ? (
    <img
      src={optimize(src)}
      alt={alt}
      loading="lazy"
      className="size-10 shrink-0 rounded-md border object-cover"
    />
  ) : (
    <div className="size-10 shrink-0 rounded-md border bg-muted" />
  );
}

export function VariantCombobox({
  value,
  valueLabel,
  onSelect,
  placeholder = "Chọn sản phẩm / biến thể",
  disabled,
  allowOutOfStock = false,
}: VariantComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({ search, status: "ACTIVE", limit: 20 });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const listRef = React.useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const el = listRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      fetchNextPage();
    }
  };

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [search]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearchInput("");
  };

  const handleSelect = (product: ProductListItem, variant?: ProductVariant) => {
    onSelect({
      productId: product.id,
      variantId: variant?.id ?? null,
      variantLabel: variant
        ? `${product.name} - ${variant.name}`
        : product.name,
      unitCost: variant ? resolveUnitCost(product, variant) : product.price,
      stock: variant ? variant.stock : product.totalStock,
      imageUrl: getImageUrl(product, variant),
    });
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {valueLabel || placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        className="w-(--anchor-width) max-w-none p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={searchInput}
            onValueChange={setSearchInput}
            placeholder="Tìm theo tên hoặc SKU..."
          />

          <CommandList ref={listRef} onScroll={handleScroll} className="p-1">
            {isLoading && (
              <div className="flex items-center justify-center gap-1 py-6 text-sm text-secondary">
                <Spinner />
                Đang tải...
              </div>
            )}

            {isError && !isLoading && (
              <div className="py-6 text-center text-sm text-destructive">
                Không tải được danh sách sản phẩm.
              </div>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy sản phẩm.
              </div>
            )}

            {products.map((product) => {
              if (product.variants.length === 0) {
                const isSelected = product.id === value;
                const outOfStock = !allowOutOfStock && product.totalStock <= 0;

                return (
                  <div key={product.id} className="mb-1">
                    <CommandItem
                      value={product.id}
                      disabled={outOfStock}
                      onSelect={() => handleSelect(product)}
                      className="gap-2 py-1.5"
                    >
                      <Thumb src={getImageUrl(product)} alt={product.name} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-medium text-foreground">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {product.sku}
                          </p>
                          <p className="text-xs text-secondary font-medium">
                            {product.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="size-4 shrink-0" />}
                    </CommandItem>
                  </div>
                );
              }

              return (
                <div key={product.id} className="mb-1.5">
                  <div className="sticky top-0 z-10 flex items-center gap-2 rounded-sm bg-muted px-2 py-1.5">
                    <Thumb src={getImageUrl(product)} alt={product.name} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-semibold uppercase tracking-wide text-foreground">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.sku}
                      </span>
                    </div>
                  </div>

                  <div className="ml-2 mt-0.5 flex flex-col gap-0.5 border-l-2 border-border pl-2">
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === value;
                      const outOfStock = !allowOutOfStock && variant.stock <= 0;

                      return (
                        <CommandItem
                          key={variant.id}
                          value={variant.id}
                          disabled={outOfStock}
                          onSelect={() => handleSelect(product, variant)}
                          className="gap-2 py-1.5"
                        >
                          <Thumb
                            src={getImageUrl(product, variant)}
                            alt={variant.name}
                          />
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-foreground">
                              {variant.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Tồn: {variant.stock} ·{" "}
                              <span className="text-secondary font-medium">
                                {resolveUnitCost(
                                  product,
                                  variant,
                                ).toLocaleString("vi-VN")}
                                đ
                              </span>
                            </span>
                          </span>
                          {isSelected && <Check className="size-4 shrink-0" />}
                        </CommandItem>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {isFetchingNextPage && (
              <div className="flex items-center justify-center gap-1 py-2 text-secondary">
                <Spinner />
                Đang tải thêm...
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
