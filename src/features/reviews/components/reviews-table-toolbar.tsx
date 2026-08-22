import { type ReactTable } from "@tanstack/react-table";

import { type Review } from "@/types/review";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface ReviewsTableToolbarProps {
  search: string;
  rating: number | undefined;
  onSearchChange: (value: string) => void;
  onRatingChange: (value: number | undefined) => void;
  table: ReactTable<DataTableFeatures, Review>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const ratingItems = [
  { label: "Tất cả đánh giá", value: "all" },
  { label: "5 sao", value: "5" },
  { label: "4 sao", value: "4" },
  { label: "3 sao", value: "3" },
  { label: "2 sao", value: "2" },
  { label: "1 sao", value: "1" },
];

const reviewColumnLabels: Record<string, string> = {
  author: "Người đánh giá",
  rating: "Đánh giá",
  content: "Nội dung",
  productId: "Sản phẩm",
  helpfulCount: "Hữu ích",
  createdAt: "Ngày tạo",
};

export function ReviewsTableToolbar({
  table,
  search,
  rating,
  onRatingChange,
  onSearchChange,
}: ReviewsTableToolbarProps) {
  const isFiltered = search.length > 0 || !!rating;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      columnLabels={reviewColumnLabels}
      onReset={() => {
        onSearchChange("");
        onRatingChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên người đánh giá hoặc nội dung..."
    >
      <Select
        items={ratingItems}
        value={rating ? String(rating) : "all"}
        onValueChange={(value: string | null) => {
          const filterValue = toFilterValue(value);
          onRatingChange(filterValue ? Number(filterValue) : undefined);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Đánh giá" />
        </SelectTrigger>
        <SelectContent>
          {ratingItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
