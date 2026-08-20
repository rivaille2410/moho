"use client";

import { Trash2 } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CreateCategoryDialog } from "./create-category-dialog";

import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { type CategoryListItem } from "@/types/category";
import { CategoryTreeItemLabel } from "./category-tree-item-label";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";
import { DataTableToolbarShell } from "@/components/data-table/data-table-toolbar-shell";

interface CategoriesTableToolbarProps {
  search: string;
  parentId: string | undefined;
  onCreated?: () => void;
  onSearchChange: (value: string) => void;
  onParentChange: (value: string | undefined) => void;
  onBulkDelete: (categories: CategoryListItem[]) => void;
  table: ReactTable<DataTableFeatures, CategoryListItem>;
}

function toFilterValue(value: string | null): string | undefined {
  return !value || value === "all" ? undefined : value;
}

const categoryColumnLabels: Record<string, string> = {
  name: "Tên danh mục",
  parent: "Danh mục cha",
  productCount: "Số sản phẩm",
  createdAt: "Ngày tạo",
};

export function CategoriesTableToolbar({
  table,
  search,
  parentId,
  onCreated,
  onBulkDelete,
  onSearchChange,
  onParentChange,
}: CategoriesTableToolbarProps) {
  const isFiltered = search.length > 0 || !!parentId;

  const { data: categoryTree } = useCategoryTree();
  const flatCategories = flattenCategoryTree(categoryTree ?? []);
  const parentItems = [
    { label: "Tất cả danh mục", value: "all" },
    ...flatCategories.map((c) => ({
      label: `${"  ".repeat(c.depth)}${c.name}`,
      value: c.id,
      item: c,
    })),
  ];

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  return (
    <DataTableToolbarShell
      table={table}
      search={search}
      isFiltered={isFiltered}
      actions={
        <>
          {selectedCount > 0 && (
            <Button
              size="lg"
              variant="destructive"
              onClick={() =>
                onBulkDelete(selectedRows.map((row) => row.original))
              }
            >
              <Trash2 className="size-4" />
              Xoá đã chọn ({selectedCount})
            </Button>
          )}

          <CreateCategoryDialog onCreated={onCreated} />
        </>
      }
      columnLabels={categoryColumnLabels}
      onReset={() => {
        onSearchChange("");
        onParentChange(undefined);
      }}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên hoặc slug..."
    >
      <Select
        items={parentItems}
        value={parentId ?? "all"}
        onValueChange={(value: string | null) =>
          onParentChange(toFilterValue(value))
        }
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Danh mục cha" />
        </SelectTrigger>
        <SelectContent>
          {parentItems.map((p) =>
            "item" in p ? (
              <SelectItem key={p.value} value={p.value}>
                <CategoryTreeItemLabel item={p.item} />
              </SelectItem>
            ) : (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </DataTableToolbarShell>
  );
}
