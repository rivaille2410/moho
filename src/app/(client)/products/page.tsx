"use client";

import { useMemo, useState } from "react";

import { Search, X } from "lucide-react";

import { PublicProductSortBy } from "@/types/product";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  usePublicColors,
  usePublicCategories,
  usePublicProductsInfinite,
} from "@/features/products/hooks/use-public-products";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import {
  ProductCard,
  ProductCardSkeleton,
} from "../(home)/_components/product-card";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

const SORT_OPTIONS: { value: PublicProductSortBy; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "best_selling", label: "Bán chạy" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

const DEFAULT_SORT: PublicProductSortBy = "newest";

const PRICE_MIN = 0;
const PRICE_MAX = 10_000_000;
const PRICE_STEP = 100_000;

type Filters = {
  search: string;
  categoryId: string | null;
  subCategoryId: string | null;
  inStockOnly: boolean;
  onSale: boolean;
  colors: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: PublicProductSortBy;
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  categoryId: null,
  subCategoryId: null,
  inStockOnly: true,
  onSale: false,
  colors: [],
  minPrice: "",
  maxPrice: "",
  sortBy: DEFAULT_SORT,
};

const ALL_CATEGORIES_VALUE = "__all__";
const ALL_SUBCATEGORIES_VALUE = "__all_sub__";

const formatVND = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("vi-VN");
};

const parseVND = (formatted: string) => formatted.replace(/\D/g, "");

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebouncedValue(filters.search, 400);
  const debouncedMinPrice = useDebouncedValue(filters.minPrice, 400);
  const debouncedMaxPrice = useDebouncedValue(filters.maxPrice, 400);

  const { data: rootCategories } = usePublicCategories({ rootOnly: true });

  const { data: subCategories } = usePublicCategories(
    { parentId: filters.categoryId ?? undefined },
    { enabled: !!filters.categoryId },
  );

  const activeCategoryId =
    filters.subCategoryId ?? filters.categoryId ?? undefined;

  const { data: colorOptions } = usePublicColors(activeCategoryId);

  const priceRange = useMemo<[number, number]>(() => {
    const min = filters.minPrice ? Number(filters.minPrice) : PRICE_MIN;
    const max = filters.maxPrice ? Number(filters.maxPrice) : PRICE_MAX;
    return [
      Number.isNaN(min)
        ? PRICE_MIN
        : Math.min(Math.max(min, PRICE_MIN), PRICE_MAX),
      Number.isNaN(max)
        ? PRICE_MAX
        : Math.min(Math.max(max, PRICE_MIN), PRICE_MAX),
    ];
  }, [filters.minPrice, filters.maxPrice]);

  const params = useMemo(() => {
    const min = debouncedMinPrice ? Number(debouncedMinPrice) : undefined;
    const max = debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined;

    return {
      limit: 16,
      search: debouncedSearch || undefined,
      categoryId: activeCategoryId,
      outOfStock: filters.inStockOnly ? false : undefined,
      onSale: filters.onSale ? true : undefined,
      colors: filters.colors.length ? filters.colors : undefined,
      minPrice: min !== undefined && !Number.isNaN(min) ? min : undefined,
      maxPrice: max !== undefined && !Number.isNaN(max) ? max : undefined,
      sortBy: filters.sortBy,
    };
  }, [
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    activeCategoryId,
    filters.inStockOnly,
    filters.onSale,
    filters.colors,
    filters.sortBy,
  ]);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublicProductsInfinite(params);

  const products = data?.pages.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages[0]?.meta.totalItems;

  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  const hasActiveFilters =
    filters.search !== DEFAULT_FILTERS.search ||
    filters.categoryId !== DEFAULT_FILTERS.categoryId ||
    filters.subCategoryId !== DEFAULT_FILTERS.subCategoryId ||
    filters.inStockOnly !== DEFAULT_FILTERS.inStockOnly ||
    filters.onSale !== DEFAULT_FILTERS.onSale ||
    filters.colors.length > 0 ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice ||
    filters.sortBy !== DEFAULT_FILTERS.sortBy;

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const toggleColor = (colorName: string) => {
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(colorName)
        ? f.colors.filter((c) => c !== colorName)
        : [...f.colors, colorName],
    }));
  };

  const handlePriceRangeChange = (value: number | readonly number[]) => {
    const [min, max] = Array.isArray(value) ? value : [value, value];
    setFilters((f) => ({
      ...f,
      minPrice: String(min),
      maxPrice: String(max),
    }));
  };

  return (
    <div className="space-y-3 pb-16">
      <PageBreadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
      />

      <div className="wrapper">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Sản phẩm
            {typeof totalItems === "number" && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            )}
          </h1>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Tìm sản phẩm..."
              className="w-full pl-8 sm:w-96"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border p-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Danh mục</Label>
            <Select
              value={filters.categoryId ?? ALL_CATEGORIES_VALUE}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  categoryId: v === ALL_CATEGORIES_VALUE ? null : v,
                  subCategoryId: null,
                  colors: [],
                }))
              }
            >
              <SelectTrigger className="w-fit">
                <SelectValue>
                  {(value: string) =>
                    value === ALL_CATEGORIES_VALUE
                      ? "Tất cả danh mục"
                      : (rootCategories?.find((c) => c.id === value)?.name ??
                        value)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES_VALUE}>
                  Tất cả danh mục
                </SelectItem>
                {rootCategories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.categoryId && !!subCategories?.length && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Danh mục con
              </Label>
              <Select
                value={filters.subCategoryId ?? ALL_SUBCATEGORIES_VALUE}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    subCategoryId: v === ALL_SUBCATEGORIES_VALUE ? null : v,
                    colors: [],
                  }))
                }
              >
                <SelectTrigger className="w-fit">
                  <SelectValue>
                    {(value: string) =>
                      value === ALL_SUBCATEGORIES_VALUE
                        ? "Tất cả danh mục con"
                        : (subCategories?.find((c) => c.id === value)?.name ??
                          value)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_SUBCATEGORIES_VALUE}>
                    Tất cả danh mục con
                  </SelectItem>
                  {subCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Khoảng giá</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Từ"
                  value={formatVND(filters.minPrice)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      minPrice: parseVND(e.target.value),
                    }))
                  }
                  className="w-32 pr-6"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  đ
                </span>
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Đến"
                  value={formatVND(filters.maxPrice)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      maxPrice: parseVND(e.target.value),
                    }))
                  }
                  className="w-32 pr-6"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  đ
                </span>
              </div>
            </div>
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-56"
            />
          </div>

          {!!colorOptions?.length && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Màu sắc</Label>
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((color) => {
                  const isSelected = filters.colors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors ${
                        isSelected
                          ? "border-secondary bg-secondary/10 ring-[3px] ring-secondary/30 text-secondary"
                          : "border-input text-muted-foreground hover:border-secondary hover:ring-[3px] hover:ring-secondary/30 hover:bg-secondary/10"
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex ?? "#d4d4d8" }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Sắp xếp</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  sortBy: (v ?? DEFAULT_SORT) as PublicProductSortBy,
                }))
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue>
                  {(value: string) =>
                    SORT_OPTIONS.find((opt) => opt.value === value)?.label ??
                    value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pb-1.5">
            <Switch
              id="in-stock-only"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                setFilters((f) => ({ ...f, inStockOnly: checked }))
              }
            />
            <Label
              htmlFor="in-stock-only"
              className="text-sm whitespace-nowrap"
            >
              Còn hàng
            </Label>
          </div>

          <div className="flex items-center gap-2 pb-1.5">
            <Switch
              id="on-sale-only"
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                setFilters((f) => ({ ...f, onSale: checked }))
              }
            />
            <Label htmlFor="on-sale-only" className="text-sm whitespace-nowrap">
              Đang giảm giá
            </Label>
          </div>

          {hasActiveFilters && (
            <Button
              variant="destructive"
              onClick={resetFilters}
              className="ml-auto"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {isError ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-medium">Đã có lỗi xảy ra</p>
            <p className="text-sm text-muted-foreground">
              Không thể tải danh sách sản phẩm. Vui lòng thử lại.
            </p>
          </div>
        ) : !isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
            <p className="text-sm text-muted-foreground">
              Thử tìm kiếm hoặc điều chỉnh bộ lọc khác.
            </p>
            {hasActiveFilters && (
              <Button variant="destructive" onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>

            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="mt-8 flex h-10 items-center justify-center"
              >
                {isFetchingNextPage && (
                  <Spinner className="size-6 text-secondary" />
                )}
              </div>
            )}

            {!hasNextPage && !isLoading && products.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Đã hiển thị tất cả sản phẩm
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
