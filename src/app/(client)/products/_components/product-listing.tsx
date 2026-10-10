"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { PublicProductSortBy } from "@/types/product";
import type { ProductsResponse } from "@/types/product";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {
  usePublicColors,
  usePublicProductsInfinite,
  usePublicBestSellersInfinite,
} from "@/features/products/hooks/use-public-products";
import { usePublicCategories } from "@/features/categories/hooks/use-public-categories";
import { useGridColumns } from "@/hooks/use-grid-columns";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import {
  ProductCard,
  ProductCardSkeleton,
} from "../../(home)/_components/product-card";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PublicApiErrorState } from "@/components/shared/public-api-error-state";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";

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

const PRICE_PRESETS = [
  { label: "Dưới 1 triệu", min: "", max: "1000000" },
  { label: "1 - 3 triệu", min: "1000000", max: "3000000" },
  { label: "3 - 5 triệu", min: "3000000", max: "5000000" },
  { label: "Trên 5 triệu", min: "5000000", max: "" },
];

const INITIAL_SKELETON_ROWS = 4;
const LOAD_MORE_SKELETON_ROWS = 2;

const TARGET_PAGE_SIZE = 16;

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

const SOURCES = {
  all: {
    useProducts: usePublicProductsInfinite,
    showSort: true,
  },
  best_sellers: {
    useProducts: usePublicBestSellersInfinite,
    showSort: false,
  },
} as const;

export type ProductListingSource = keyof typeof SOURCES;

function FilterPill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm",
        active
          ? "border-secondary bg-secondary/10 font-medium text-secondary"
          : "border-input text-muted-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-secondary py-1.5 pl-3.5 pr-2 text-sm font-medium text-white">
      {label}
      <button
        type="button"
        aria-label={`Bỏ lọc ${label}`}
        onClick={onRemove}
        className="flex size-5 items-center justify-center rounded-full bg-white/20"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function SheetSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

type ProductListingProps = {
  source: ProductListingSource;
  title: string;
  breadcrumbLabel?: string;
  initialPage?: ProductsResponse;
};

export function ProductListing({
  source,
  title,
  breadcrumbLabel,
  initialPage,
}: ProductListingProps) {
  const { useProducts, showSort } = SOURCES[source];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const columns = useGridColumns();

  const urlCategoryId = searchParams.get("categoryId");
  const urlSubCategoryId = searchParams.get("subCategoryId");
  const urlSearch = searchParams.get("search") ?? "";

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    search: urlSearch,
    categoryId: urlCategoryId,
    subCategoryId: urlSubCategoryId,
  });

  useEffect(() => {
    setFilters((f) => {
      const sameCategory =
        f.categoryId === urlCategoryId && f.subCategoryId === urlSubCategoryId;

      if (sameCategory && f.search === urlSearch) return f;

      return {
        ...f,
        search: urlSearch,
        categoryId: urlCategoryId,
        subCategoryId: urlSubCategoryId,
        colors: sameCategory ? f.colors : [],
      };
    });
  }, [urlCategoryId, urlSubCategoryId, urlSearch]);

  const syncCategoryToUrl = (cat: string | null, sub: string | null) => {
    const qs = new URLSearchParams();
    if (cat) qs.set("categoryId", cat);
    if (sub) qs.set("subCategoryId", sub);
    if (filters.search.trim()) qs.set("search", filters.search.trim());
    const query = qs.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const selectCategory = (next: string | null) => {
    setFilters((f) => ({
      ...f,
      categoryId: next,
      subCategoryId: null,
      colors: [],
    }));
    syncCategoryToUrl(next, null);
  };

  const selectSubCategory = (next: string | null) => {
    setFilters((f) => ({
      ...f,
      subCategoryId: next,
      colors: [],
    }));
    syncCategoryToUrl(filters.categoryId, next);
  };

  const clearSearch = () => {
    setFilters((f) => ({ ...f, search: "" }));

    const qs = new URLSearchParams();
    if (filters.categoryId) qs.set("categoryId", filters.categoryId);
    if (filters.subCategoryId) qs.set("subCategoryId", filters.subCategoryId);
    const query = qs.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const clearAllFilters = () => {
    setFilters((f) => ({ ...DEFAULT_FILTERS, search: f.search }));

    const qs = new URLSearchParams();
    if (filters.search.trim()) qs.set("search", filters.search.trim());
    const query = qs.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

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

  const pageSize = useMemo(() => {
    const cols = Math.max(1, columns);
    return cols * Math.ceil(TARGET_PAGE_SIZE / cols);
  }, [columns]);

  const params = useMemo(() => {
    const min = debouncedMinPrice ? Number(debouncedMinPrice) : undefined;
    const max = debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined;

    return {
      limit: pageSize,
      search: debouncedSearch || undefined,
      categoryId: activeCategoryId,
      outOfStock: filters.inStockOnly ? false : undefined,
      onSale: filters.onSale ? true : undefined,
      colors: filters.colors.length ? filters.colors : undefined,
      minPrice: min !== undefined && !Number.isNaN(min) ? min : undefined,
      maxPrice: max !== undefined && !Number.isNaN(max) ? max : undefined,
      sortBy: showSort ? filters.sortBy : undefined,
    };
  }, [
    pageSize,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    activeCategoryId,
    filters.inStockOnly,
    filters.onSale,
    filters.colors,
    filters.sortBy,
    showSort,
  ]);

  const {
    data,
    isLoading,
    isLoadingError,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useProducts(params, initialPage);

  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const totalItems = data?.pages[0]?.meta.totalItems;

  const visibleProducts = useMemo(() => {
    if (!hasNextPage) return allProducts;
    const fullRowsCount = Math.floor(allProducts.length / columns) * columns;
    return allProducts.slice(0, fullRowsCount);
  }, [allProducts, hasNextPage, columns]);

  const initialSkeletonCount = columns * INITIAL_SKELETON_ROWS;
  const loadMoreSkeletonCount =
    ((columns - (visibleProducts.length % columns)) % columns) +
    columns * LOAD_MORE_SKELETON_ROWS;

  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    hasError: isFetchNextPageError,
    onLoadMore: () => fetchNextPage(),
  });

  const sortChanged = showSort && filters.sortBy !== DEFAULT_SORT;

  const hasActiveFilters =
    filters.search !== DEFAULT_FILTERS.search ||
    filters.categoryId !== DEFAULT_FILTERS.categoryId ||
    filters.subCategoryId !== DEFAULT_FILTERS.subCategoryId ||
    filters.inStockOnly !== DEFAULT_FILTERS.inStockOnly ||
    filters.onSale !== DEFAULT_FILTERS.onSale ||
    filters.colors.length > 0 ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice ||
    sortChanged;

  const activeFilterCount =
    (filters.categoryId ? 1 : 0) +
    (filters.subCategoryId ? 1 : 0) +
    (filters.inStockOnly !== DEFAULT_FILTERS.inStockOnly ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    filters.colors.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (sortChanged ? 1 : 0);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    router.replace(pathname, { scroll: false });
  };

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

  const clearPrice = () => {
    setFilters((f) => ({ ...f, minPrice: "", maxPrice: "" }));
  };

  const applyPricePreset = (min: string, max: string) => {
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max }));
  };

  const categoryName = rootCategories?.find(
    (c) => c.id === filters.categoryId,
  )?.name;
  const subCategoryName = subCategories?.find(
    (c) => c.id === filters.subCategoryId,
  )?.name;

  const priceLabel = (() => {
    if (!filters.minPrice && !filters.maxPrice) return null;
    if (filters.minPrice && filters.maxPrice) {
      return `${formatVND(filters.minPrice)}đ - ${formatVND(filters.maxPrice)}đ`;
    }
    return filters.minPrice
      ? `Từ ${formatVND(filters.minPrice)}đ`
      : `Đến ${formatVND(filters.maxPrice)}đ`;
  })();

  return (
    <div className="space-y-3 pb-16">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: breadcrumbLabel ?? title },
        ]}
      />

      <div className="wrapper">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
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
              className="w-full pl-8 pr-9 sm:w-96"
            />
            {filters.search && (
              <button
                type="button"
                aria-label="Xoá từ khoá"
                onClick={clearSearch}
                className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-5 md:hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border bg-background px-3.5 py-2 text-sm font-medium"
            >
              <SlidersHorizontal className="size-4" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <FilterPill
              active={filters.inStockOnly}
              onClick={() =>
                setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))
              }
            >
              Còn hàng
            </FilterPill>

            <FilterPill
              active={filters.onSale}
              onClick={() => setFilters((f) => ({ ...f, onSale: !f.onSale }))}
            >
              Đang giảm giá
            </FilterPill>

            {filters.categoryId && (
              <ActiveChip
                label={categoryName ?? "Danh mục"}
                onRemove={() => selectCategory(null)}
              />
            )}

            {filters.subCategoryId && (
              <ActiveChip
                label={subCategoryName ?? "Danh mục con"}
                onRemove={() => selectSubCategory(null)}
              />
            )}

            {filters.colors.map((color) => (
              <ActiveChip
                key={color}
                label={color}
                onRemove={() => toggleColor(color)}
              />
            ))}

            {priceLabel && (
              <ActiveChip label={priceLabel} onRemove={clearPrice} />
            )}

            {sortChanged && (
              <ActiveChip
                label={
                  SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ??
                  "Sắp xếp"
                }
                onRemove={() =>
                  setFilters((f) => ({ ...f, sortBy: DEFAULT_SORT }))
                }
              />
            )}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="shrink-0 whitespace-nowrap px-2 py-2 text-sm font-medium text-destructive"
              >
                Xoá tất cả
              </button>
            )}
          </div>
        </div>

        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent
            side="bottom"
            className="flex max-h-[88dvh] flex-col gap-0 rounded-t-2xl p-0"
          >
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
              {showSort && (
                <SheetSection title="Sắp xếp">
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((opt) => (
                      <FilterPill
                        key={opt.value}
                        active={filters.sortBy === opt.value}
                        onClick={() =>
                          setFilters((f) => ({ ...f, sortBy: opt.value }))
                        }
                      >
                        {opt.label}
                      </FilterPill>
                    ))}
                  </div>
                </SheetSection>
              )}

              <SheetSection title="Danh mục">
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    active={!filters.categoryId}
                    onClick={() => selectCategory(null)}
                  >
                    Tất cả
                  </FilterPill>
                  {rootCategories?.map((cat) => (
                    <FilterPill
                      key={cat.id}
                      active={filters.categoryId === cat.id}
                      onClick={() => selectCategory(cat.id)}
                    >
                      {cat.name}
                    </FilterPill>
                  ))}
                </div>

                {filters.categoryId && !!subCategories?.length && (
                  <div className="space-y-2 border-l-2 pl-3">
                    <p className="text-xs text-muted-foreground">
                      Danh mục con
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <FilterPill
                        active={!filters.subCategoryId}
                        onClick={() => selectSubCategory(null)}
                      >
                        Tất cả
                      </FilterPill>
                      {subCategories.map((cat) => (
                        <FilterPill
                          key={cat.id}
                          active={filters.subCategoryId === cat.id}
                          onClick={() => selectSubCategory(cat.id)}
                        >
                          {cat.name}
                        </FilterPill>
                      ))}
                    </div>
                  </div>
                )}
              </SheetSection>

              <SheetSection title="Khoảng giá">
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => (
                    <FilterPill
                      key={preset.label}
                      active={
                        filters.minPrice === preset.min &&
                        filters.maxPrice === preset.max
                      }
                      onClick={() => applyPricePreset(preset.min, preset.max)}
                    >
                      {preset.label}
                    </FilterPill>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
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
                      className="w-full pr-6"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      đ
                    </span>
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="relative flex-1">
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
                      className="w-full pr-6"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      đ
                    </span>
                  </div>
                </div>

                <div className="px-1 pt-1">
                  <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="w-full"
                  />
                </div>
              </SheetSection>

              {!!colorOptions?.length && (
                <SheetSection title="Màu sắc">
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <FilterPill
                        key={color.name}
                        active={filters.colors.includes(color.name)}
                        onClick={() => toggleColor(color.name)}
                      >
                        <span
                          className="size-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex ?? "#d4d4d8" }}
                        />
                        {color.name}
                      </FilterPill>
                    ))}
                  </div>
                </SheetSection>
              )}

              <SheetSection title="Tình trạng">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor="sheet-in-stock-only"
                      className="text-sm font-normal"
                    >
                      Chỉ hiện sản phẩm còn hàng
                    </Label>
                    <Switch
                      id="sheet-in-stock-only"
                      checked={filters.inStockOnly}
                      onCheckedChange={(checked) =>
                        setFilters((f) => ({ ...f, inStockOnly: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor="sheet-on-sale-only"
                      className="text-sm font-normal"
                    >
                      Chỉ hiện sản phẩm đang giảm giá
                    </Label>
                    <Switch
                      id="sheet-on-sale-only"
                      checked={filters.onSale}
                      onCheckedChange={(checked) =>
                        setFilters((f) => ({ ...f, onSale: checked }))
                      }
                    />
                  </div>
                </div>
              </SheetSection>
            </div>

            <div className="flex gap-3 border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button
                size="xl"
                variant="outline"
                className="flex-1"
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                Xoá bộ lọc
              </Button>
              <Button
                size="xl"
                className="flex-2"
                onClick={() => setFilterOpen(false)}
              >
                {typeof totalItems === "number"
                  ? `Xem ${totalItems} sản phẩm`
                  : "Xem sản phẩm"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="mb-6 hidden flex-wrap items-end gap-3 rounded-lg border p-3 md:flex">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Danh mục</Label>
            <Select
              value={filters.categoryId ?? ALL_CATEGORIES_VALUE}
              onValueChange={(v) =>
                selectCategory(v === ALL_CATEGORIES_VALUE ? null : v)
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
                  selectSubCategory(v === ALL_SUBCATEGORIES_VALUE ? null : v)
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

          {showSort && (
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
          )}

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

        {isLoadingError ? (
          <PublicApiErrorState
            onRetry={() => void refetch()}
            isRetrying={isFetching}
          />
        ) : !isLoading && allProducts.length === 0 ? (
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
                ? Array.from({ length: initialSkeletonCount }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}

              {isFetchingNextPage &&
                Array.from({ length: loadMoreSkeletonCount }).map((_, i) => (
                  <ProductCardSkeleton key={`more-${i}`} />
                ))}
            </div>

            {isLoading && <PublicApiLoadingHint className="mt-4" />}

            {hasNextPage && <div ref={sentinelRef} className="h-px" />}

            {isFetchNextPageError && (
              <PublicApiErrorState
                compact
                onRetry={() => void fetchNextPage()}
                isRetrying={isFetchingNextPage}
              />
            )}

            {!hasNextPage && !isLoading && allProducts.length > 0 && (
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

export function ProductListingSkeleton({
  title,
  breadcrumbLabel,
}: {
  title: string;
  breadcrumbLabel?: string;
}) {
  return (
    <div className="space-y-3 pb-16">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: breadcrumbLabel ?? title },
        ]}
      />

      <div className="wrapper">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <div className="h-9 w-full animate-pulse rounded-md bg-muted sm:w-96" />
        </div>

        <div className="mb-5 flex gap-2 overflow-hidden md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        <div className="mb-6 hidden h-22 animate-pulse rounded-lg border bg-muted/40 md:block" />

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
