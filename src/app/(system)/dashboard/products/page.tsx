"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ProductListItem, ProductStatus } from "@/types/product";
import { useProducts } from "@/features/products/hooks/use-products";
import { useDeleteProduct } from "@/features/products/hooks/use-delete-product";
import { useBulkDeleteProducts } from "@/features/products/hooks/use-bulk-delete-products";
import { useUpdateProductStatus } from "@/features/products/hooks/use-update-product-status";

import { getColumns } from "@/features/products/components/columns";
import { ProductsTableToolbar } from "@/features/products/components/products-table-toolbar";

const DashboardProducts = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ProductStatus | undefined>(
    undefined,
  );
  const [outOfStock, setOutOfStock] = React.useState<boolean | undefined>(
    undefined,
  );
  const [productToDelete, setProductToDelete] =
    React.useState<ProductListItem | null>(null);
  const [productsToBulkDelete, setProductsToBulkDelete] = React.useState<
    ProductListItem[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    ProductListItem
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useProducts({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
    outOfStock,
  });

  const deleteProduct = useDeleteProduct();
  const updateStatus = useUpdateProductStatus();
  const bulkDeleteProducts = useBulkDeleteProducts();

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (product: ProductListItem) => {
          router.push(`/dashboard/products/${product.id}`);
        },
        onDelete: (product: ProductListItem) => setProductToDelete(product),
        onChangeStatus: (product: ProductListItem, newStatus: string) =>
          updateStatus.mutate({
            id: product.id,
            status: newStatus as ProductStatus,
          }),
      }),
    [router, updateStatus],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: ProductStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleOutOfStockChange = (value: boolean | undefined) => {
    setOutOfStock(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!productsToBulkDelete) return;

    bulkDeleteProducts.mutate(
      productsToBulkDelete.map((product) => product.id),
      {
        onSuccess: () => {
          setProductsToBulkDelete(null);
          tableRef.current?.resetRowSelection();
        },
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="@container/main flex flex-1 flex-col gap-2 min-h-0">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 min-h-0">
          <div className="flex h-full min-h-0 flex-col">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              meta={
                data?.meta ?? {
                  page,
                  limit,
                  totalItems: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPreviousPage: false,
                }
              }
              isLoading={isLoading}
              onPageChange={setPage}
              onLimitChange={(value) => {
                setPage(1);
                setLimit(value);
              }}
              toolbar={(table) => {
                tableRef.current = table;

                return (
                  <ProductsTableToolbar
                    table={table}
                    search={search}
                    status={status}
                    outOfStock={outOfStock}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                    onOutOfStockChange={handleOutOfStockChange}
                    onBulkDelete={(products) =>
                      setProductsToBulkDelete(products)
                    }
                    categoryId={undefined}
                    onCategoryChange={() => {}}
                  />
                );
              }}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!productToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá sản phẩm?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteProduct.isPending}
              onOpenChange={(open) => !open && setProductToDelete(null)}
              description={
                <>
                  Bạn sắp xoá sản phẩm{" "}
                  <span className="font-medium text-foreground">
                    {productToDelete?.name}
                  </span>{" "}
                  ({productToDelete?.sku}). Sản phẩm có thể được khôi phục sau
                  nếu cần.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!productsToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteProducts.isPending}
              title={`Xoá ${productsToBulkDelete?.length ?? 0} sản phẩm?`}
              onOpenChange={(open) => !open && setProductsToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {productsToBulkDelete?.length ?? 0} sản phẩm
                  </span>{" "}
                  đã chọn.
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
