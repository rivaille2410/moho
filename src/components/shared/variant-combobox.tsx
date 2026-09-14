"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteProducts } from "@/features/products/hooks/use-infinite-products";
import type { ProductListItem, ProductVariant } from "@/types/product";
import { Spinner } from "../ui/spinner";

export interface VariantSelection {
  variantId: string;
  variantLabel: string;
  unitCost: number;
  stock: number;
}

interface VariantComboboxProps {
  value?: string;
  valueLabel?: string;
  onSelect: (option: VariantSelection) => void;
  placeholder?: string;
  disabled?: boolean;
}

function resolveUnitCost(product: ProductListItem, variant: ProductVariant) {
  return variant.priceOverride ?? product.price;
}

export function VariantCombobox({
  value,
  valueLabel,
  onSelect,
  placeholder = "Chọn sản phẩm / biến thể",
  disabled,
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

  const handleSelect = (product: ProductListItem, variant: ProductVariant) => {
    onSelect({
      variantId: variant.id,
      variantLabel: `${product.name} - ${variant.name}`,
      unitCost: resolveUnitCost(product, variant),
      stock: variant.stock,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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

      <PopoverContent className="w-fit p-0" align="start">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="size-4 shrink-0 opacity-50" />
          <Input
            autoFocus
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên hoặc SKU..."
            className="h-8 border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>

        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-72 overflow-y-auto p-1"
        >
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
            if (product.variants.length === 0) return null;

            return (
              <div key={product.id} className="mb-1.5">
                <div className="sticky top-0 z-10 flex items-baseline gap-1.5 rounded-sm bg-muted px-2 py-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    {product.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.sku}
                  </span>
                </div>

                <div className="mt-0.5 flex flex-col gap-0.5 border-l-2 border-border pl-2 ml-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === value;
                    const outOfStock = variant.stock <= 0;

                    return (
                      <button
                        type="button"
                        key={variant.id}
                        disabled={outOfStock}
                        onClick={() => handleSelect(product, variant)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent",
                          isSelected && "bg-accent",
                        )}
                      >
                        <span className="flex flex-col items-start">
                          <span className="font-normal text-foreground">
                            {variant.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Tồn: {variant.stock} ·{" "}
                            {resolveUnitCost(product, variant).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </span>
                        </span>
                        {isSelected && <Check className="size-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-1 py-2 text-xs text-secondary">
              <Spinner />
              Đang tải thêm...
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
