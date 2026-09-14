"use client";

import * as React from "react";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { type Warehouse } from "@/types/warehouse";

import { DataTable } from "@/components/data-table/data-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import { useWarehouses } from "@/features/warehouses/hooks/use-warehouses";
import { useDeleteWarehouse } from "@/features/warehouses/hooks/use-delete-warehouse";
import { useBulkDeleteWarehouses } from "@/features/warehouses/hooks/use-bulk-delete-warehouses";

import { getColumns } from "@/features/warehouses/components/columns";
import { WarehouseFormDialog } from "@/features/warehouses/components/warehouse-form-dialog";
import { WarehousesTableToolbar } from "@/features/warehouses/components/warehouses-table-toolbar";

function getWarehouseFullAddress(warehouse: Warehouse) {
  return [warehouse.addressDetail, warehouse.wardName, warehouse.provinceName]
    .filter(Boolean)
    .join(", ");
}

const DashboardWarehouses = () => {
  const [search, setSearch] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [warehouseToEdit, setWarehouseToEdit] =
    React.useState<Warehouse | null>(null);
  const [warehouseToDelete, setWarehouseToDelete] =
    React.useState<Warehouse | null>(null);
  const [warehousesToBulkDelete, setWarehousesToBulkDelete] = React.useState<
    Warehouse[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    Warehouse
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useWarehouses();

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (!debouncedSearch) return data;

    const keyword = debouncedSearch.toLowerCase();
    return data.filter((warehouse) => {
      const fullAddress = getWarehouseFullAddress(warehouse).toLowerCase();
      return (
        warehouse.name.toLowerCase().includes(keyword) ||
        fullAddress.includes(keyword)
      );
    });
  }, [data, debouncedSearch]);

  const deleteWarehouse = useDeleteWarehouse();
  const bulkDeleteWarehouses = useBulkDeleteWarehouses();

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (warehouse) => {
          setWarehouseToEdit(warehouse);
          setFormOpen(true);
        },
        onDelete: (warehouse) => setWarehouseToDelete(warehouse),
      }),
    [],
  );

  const handleConfirmDelete = () => {
    if (!warehouseToDelete) return;

    deleteWarehouse.mutate(warehouseToDelete.id, {
      onSuccess: () => setWarehouseToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!warehousesToBulkDelete) return;

    bulkDeleteWarehouses.mutate(
      warehousesToBulkDelete.map((warehouse) => warehouse.id),
      {
        onSuccess: () => {
          setWarehousesToBulkDelete(null);
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
              data={filteredData}
              isLoading={isLoading}
              meta={{
                page: 1,
                limit: filteredData.length,
                totalItems: filteredData.length,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
              }}
              onPageChange={() => {}}
              onLimitChange={() => {}}
              toolbar={(table) => {
                tableRef.current = table;

                return (
                  <WarehousesTableToolbar
                    table={table}
                    search={search}
                    onSearchChange={setSearch}
                    onCreate={() => {
                      setWarehouseToEdit(null);
                      setFormOpen(true);
                    }}
                    onBulkDelete={(warehouses) =>
                      setWarehousesToBulkDelete(warehouses)
                    }
                  />
                );
              }}
            />

            <WarehouseFormDialog
              warehouse={warehouseToEdit}
              open={formOpen}
              onOpenChange={setFormOpen}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!warehouseToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá kho hàng?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteWarehouse.isPending}
              onOpenChange={(open) => !open && setWarehouseToDelete(null)}
              description={
                <>
                  Bạn sắp xoá kho hàng{" "}
                  <span className="font-medium text-foreground">
                    {warehouseToDelete?.name}
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
              open={!!warehousesToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteWarehouses.isPending}
              title={`Xoá ${warehousesToBulkDelete?.length ?? 0} kho hàng?`}
              onOpenChange={(open) => !open && setWarehousesToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {warehousesToBulkDelete?.length ?? 0} kho hàng
                  </span>{" "}
                  đã chọn. Kho chính hoặc kho đang có đơn nhập hàng chưa hoàn
                  tất sẽ không thể xoá.
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWarehouses;
