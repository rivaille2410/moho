"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Trash2Icon } from "lucide-react";
import { type ReactTable } from "@tanstack/react-table";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { VoucherListItem, VoucherStatus } from "@/types/voucher";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import { useVouchers } from "@/features/vouchers/hooks/use-vouchers";
import { useDeleteVoucher } from "@/features/vouchers/hooks/use-delete-voucher";
import { useBulkDeleteVouchers } from "@/features/vouchers/hooks/use-bulk-delete-vouchers";
import { useUpdateVoucherStatus } from "@/features/vouchers/hooks/use-update-voucher-status";

import { getColumns } from "@/features/vouchers/components/columns";
import { VouchersTableToolbar } from "@/features/vouchers/components/vouchers-table-toolbar";

const DashboardVouchers = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<VoucherStatus | undefined>(
    undefined,
  );
  const [voucherToDelete, setVoucherToDelete] =
    React.useState<VoucherListItem | null>(null);
  const [vouchersToBulkDelete, setVouchersToBulkDelete] = React.useState<
    VoucherListItem[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    VoucherListItem
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useVouchers({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const deleteVoucher = useDeleteVoucher();
  const updateStatus = useUpdateVoucherStatus();
  const bulkDeleteVoucher = useBulkDeleteVouchers();

  const columns = React.useMemo(
    () =>
      getColumns({
        onEdit: (voucher: VoucherListItem) => {
          router.push(`/dashboard/vouchers/${voucher.id}`);
        },
        onDelete: (voucher: VoucherListItem) => setVoucherToDelete(voucher),
        onChangeStatus: (voucher: VoucherListItem, newStatus: string) =>
          updateStatus.mutate({
            id: voucher.id,
            status: newStatus as VoucherStatus,
          }),
      }),
    [router, updateStatus],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: VoucherStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!voucherToDelete) return;

    deleteVoucher.mutate(voucherToDelete.id, {
      onSuccess: () => setVoucherToDelete(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!vouchersToBulkDelete) return;

    bulkDeleteVoucher.mutate(
      vouchersToBulkDelete.map((voucher) => voucher.id),
      {
        onSuccess: () => {
          setVouchersToBulkDelete(null);
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
                  <VouchersTableToolbar
                    table={table}
                    search={search}
                    status={status}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                    onBulkDelete={(vouchers) =>
                      setVouchersToBulkDelete(vouchers)
                    }
                  />
                );
              }}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!voucherToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá voucher?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteVoucher.isPending}
              onOpenChange={(open) => !open && setVoucherToDelete(null)}
              description={
                <>
                  Bạn sắp xoá voucher{" "}
                  <span className="font-medium text-foreground">
                    {voucherToDelete?.code}
                  </span>
                  . Voucher có thể được khôi phục sau nếu cần.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!vouchersToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteVoucher.isPending}
              title={`Xoá ${vouchersToBulkDelete?.length ?? 0} voucher?`}
              onOpenChange={(open) => !open && setVouchersToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá{" "}
                  <span className="font-medium text-foreground">
                    {vouchersToBulkDelete?.length ?? 0} voucher
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

export default DashboardVouchers;
