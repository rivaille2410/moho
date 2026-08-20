"use client";

import * as React from "react";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { CategoryListItem } from "@/types/category";

import { getColumns } from "@/features/categories/components/columns";
import { UpdateCategoryDialog } from "@/features/categories/components/update-category-dialog";
import { CategoriesTableToolbar } from "@/features/categories/components/categories-table-toolbar";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useDeleteCategory } from "@/features/categories/hooks/use-delete-category";
import { useBulkDeleteCategories } from "@/features/categories/hooks/use-bulk-delete-categories";

const STATIC_META = {
  page: 1,
  limit: 0,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DashboardCategories = () => {
  const [search, setSearch] = React.useState("");
  const [parentId, setParentId] = React.useState<string | undefined>(undefined);

  const [categoryToEdit, setCategoryToEdit] =
    React.useState<CategoryListItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<CategoryListItem | null>(null);
  const [categoriesToBulkDelete, setCategoriesToBulkDelete] = React.useState<
    CategoryListItem[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    CategoryListItem
  > | null>(null);

  // Ref cho container scroll của trang/bảng
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useCategories({
    parentId,
    search: debouncedSearch || undefined,
  });

  const categories = React.useMemo(() => {
    return [...(data ?? [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  const deleteCategory = useDeleteCategory();
  const bulkDeleteCategories = useBulkDeleteCategories();

  const { data: categoryTree } = useCategoryTree();
  const categoryNameById = React.useMemo(() => {
    const map: Record<string, string> = {};
    flattenCategoryTree(categoryTree ?? []).forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categoryTree]);

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (category) => setCategoryToEdit(category),
        onDelete: (category) => setCategoryToDelete(category),
        categoryNameById,
      }),
    [categoryNameById],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleParentChange = (value: string | undefined) => {
    setParentId(value);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    deleteCategory.mutate(categoryToDelete.id, {
      onSuccess: () => setCategoryToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!categoriesToBulkDelete) return;

    bulkDeleteCategories.mutate(
      categoriesToBulkDelete.map((category) => category.id),
      {
        onSuccess: () => {
          setCategoriesToBulkDelete(null);
          tableRef.current?.resetRowSelection();
        },
      },
    );
  };

  // Cuộn bảng/trang về đầu, dùng khi vừa tạo danh mục mới
  const scrollTableToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryCreated = () => {
    tableRef.current?.resetRowSelection();
    scrollTableToTop();
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-1 flex-col min-h-0 overflow-y-auto"
    >
      <div className="@container/main flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 min-h-0">
          <div className="flex h-full min-h-0 flex-col">
            <DataTable
              columns={columns}
              data={categories}
              meta={{
                ...STATIC_META,
                totalItems: categories.length,
                limit: categories.length,
              }}
              isLoading={isLoading}
              onPageChange={() => {}}
              onLimitChange={() => {}}
              toolbar={(table) => {
                tableRef.current = table;

                return (
                  <CategoriesTableToolbar
                    table={table}
                    search={search}
                    parentId={parentId}
                    onSearchChange={handleSearchChange}
                    onParentChange={handleParentChange}
                    onCreated={handleCategoryCreated}
                    onBulkDelete={(categories) =>
                      setCategoriesToBulkDelete(categories)
                    }
                  />
                );
              }}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá danh mục?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              open={!!categoryToDelete}
              isPending={deleteCategory.isPending}
              onOpenChange={(open) => !open && setCategoryToDelete(null)}
              description={
                <>
                  Bạn sắp xoá danh mục{" "}
                  <span className="font-medium text-foreground">
                    {categoryToDelete?.name}
                  </span>
                  . Các sản phẩm thuộc danh mục này sẽ không còn được phân loại.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!categoriesToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteCategories.isPending}
              title={`Xoá ${categoriesToBulkDelete?.length ?? 0} danh mục?`}
              onOpenChange={(open) => !open && setCategoriesToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {categoriesToBulkDelete?.length ?? 0} danh mục
                  </span>{" "}
                  đã chọn. Các danh mục có danh mục con hoặc còn sản phẩm sẽ
                  được bỏ qua, không bị xoá.
                </>
              }
            />
          </div>
        </div>
      </div>

      <UpdateCategoryDialog
        category={categoryToEdit}
        onOpenChange={(open) => !open && setCategoryToEdit(null)}
      />
    </div>
  );
};

export default DashboardCategories;
