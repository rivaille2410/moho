"use client";

import * as React from "react";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { type Supplier } from "@/types/supplier";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { useDeleteSupplier } from "@/features/suppliers/hooks/use-delete-supplier";
import { useBulkDeleteSuppliers } from "@/features/suppliers/hooks/use-bulk-delete-suppliers";

import { getColumns } from "@/features/suppliers/components/columns";
import { SupplierFormDialog } from "@/features/suppliers/components/supplier-form-dialog";
import { SuppliersTableToolbar } from "@/features/suppliers/components/suppliers-table-toolbar";

const DashboardSuppliers = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [supplierIdToEdit, setSupplierIdToEdit] = React.useState<string | null>(
    null,
  );
  const [supplierToDelete, setSupplierToDelete] =
    React.useState<Supplier | null>(null);
  const [suppliersToBulkDelete, setSuppliersToBulkDelete] = React.useState<
    Supplier[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<DataTableFeatures, Supplier> | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useSuppliers({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const deleteSupplier = useDeleteSupplier();
  const bulkDeleteSuppliers = useBulkDeleteSuppliers();

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (supplier) => {
          setSupplierIdToEdit(supplier.id);
          setFormOpen(true);
        },
        onDelete: (supplier) => setSupplierToDelete(supplier),
      }),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!supplierToDelete) return;

    deleteSupplier.mutate(supplierToDelete.id, {
      onSuccess: () => setSupplierToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!suppliersToBulkDelete) return;

    bulkDeleteSuppliers.mutate(
      suppliersToBulkDelete.map((supplier) => supplier.id),
      {
        onSuccess: () => {
          setSuppliersToBulkDelete(null);
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
                  <SuppliersTableToolbar
                    table={table}
                    search={search}
                    onSearchChange={handleSearchChange}
                    onCreate={() => {
                      setSupplierIdToEdit(null);
                      setFormOpen(true);
                    }}
                    onBulkDelete={(suppliers) =>
                      setSuppliersToBulkDelete(suppliers)
                    }
                  />
                );
              }}
            />

            <SupplierFormDialog
              supplierId={supplierIdToEdit}
              open={formOpen}
              onOpenChange={setFormOpen}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!supplierToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá nhà cung cấp?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteSupplier.isPending}
              onOpenChange={(open) => !open && setSupplierToDelete(null)}
              description={
                <>
                  Bạn sắp xoá nhà cung cấp{" "}
                  <span className="font-medium text-foreground">
                    {supplierToDelete?.name}
                  </span>
                  . Hành động này không thể hoàn tác.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!suppliersToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteSuppliers.isPending}
              title={`Xoá ${suppliersToBulkDelete?.length ?? 0} nhà cung cấp?`}
              onOpenChange={(open) => !open && setSuppliersToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {suppliersToBulkDelete?.length ?? 0} nhà cung cấp
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

export default DashboardSuppliers;
