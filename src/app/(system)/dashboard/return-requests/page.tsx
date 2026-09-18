"use client";

import * as React from "react";

import { type ReactTable } from "@tanstack/react-table";
import { CheckCircle2, PackageCheck, Flag } from "lucide-react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ReturnRequestListItem, ReturnStatus } from "@/types/return-request";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

import { getColumns } from "@/features/return-requests/components/columns";
import { ReturnRequestsTableToolbar } from "@/features/return-requests/components/return-requests-table-toolbar";
import { RejectReturnRequestDialog } from "@/features/return-requests/components/reject-return-request-dialog";
import { useReturnRequests } from "@/features/return-requests/hooks/use-return-requests";
import { useMarkItemReceived } from "@/features/return-requests/hooks/use-mark-item-received";
import { ProcessRefundDialog } from "@/features/return-requests/components/process-refund-dialog";
import { useApproveReturnRequest } from "@/features/return-requests/hooks/use-approve-return-request";
import { useCompleteReturnRequest } from "@/features/return-requests/hooks/use-complete-return-request";

const DashboardReturnRequests = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ReturnStatus | undefined>(
    undefined,
  );

  const [itemToApprove, setItemToApprove] =
    React.useState<ReturnRequestListItem | null>(null);
  const [itemToReject, setItemToReject] =
    React.useState<ReturnRequestListItem | null>(null);
  const [itemToMarkReceived, setItemToMarkReceived] =
    React.useState<ReturnRequestListItem | null>(null);
  const [itemToRefund, setItemToRefund] =
    React.useState<ReturnRequestListItem | null>(null);
  const [itemToComplete, setItemToComplete] =
    React.useState<ReturnRequestListItem | null>(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    ReturnRequestListItem
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useReturnRequests({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const approveReturnRequest = useApproveReturnRequest();
  const markItemReceived = useMarkItemReceived();
  const completeReturnRequest = useCompleteReturnRequest();

  const columns = React.useMemo(
    () =>
      getColumns({
        onApprove: (item) => setItemToApprove(item),
        onReject: (item) => setItemToReject(item),
        onMarkReceived: (item) => setItemToMarkReceived(item),
        onProcessRefund: (item) => setItemToRefund(item),
        onComplete: (item) => setItemToComplete(item),
      }),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: ReturnStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const handleConfirmApprove = () => {
    if (!itemToApprove) return;
    approveReturnRequest.mutate(
      { id: itemToApprove.id },
      { onSuccess: () => setItemToApprove(null) },
    );
  };

  const handleConfirmMarkReceived = () => {
    if (!itemToMarkReceived) return;
    markItemReceived.mutate(itemToMarkReceived.id, {
      onSuccess: () => setItemToMarkReceived(null),
    });
  };

  const handleConfirmComplete = () => {
    if (!itemToComplete) return;
    completeReturnRequest.mutate(itemToComplete.id, {
      onSuccess: () => setItemToComplete(null),
    });
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
                  <ReturnRequestsTableToolbar
                    table={table}
                    search={search}
                    status={status}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                  />
                );
              }}
            />

            <ConfirmActionDialog
              variant="default"
              confirmLabel="Duyệt"
              open={!!itemToApprove}
              icon={<CheckCircle2 />}
              title="Duyệt yêu cầu đổi trả?"
              pendingLabel="Đang duyệt..."
              onConfirm={handleConfirmApprove}
              isPending={approveReturnRequest.isPending}
              onOpenChange={(open) => !open && setItemToApprove(null)}
              description={
                <>
                  Bạn sắp duyệt yêu cầu{" "}
                  <span className="font-medium text-foreground">
                    {itemToApprove?.code}
                  </span>
                  . Khách hàng sẽ được yêu cầu gửi trả sản phẩm.
                </>
              }
            />

            <RejectReturnRequestDialog
              item={itemToReject}
              onOpenChange={(open) => !open && setItemToReject(null)}
            />

            <ConfirmActionDialog
              confirmLabel="Xác nhận"
              icon={<PackageCheck />}
              pendingLabel="Đang cập nhật..."
              open={!!itemToMarkReceived}
              title="Xác nhận đã nhận hàng trả về?"
              onConfirm={handleConfirmMarkReceived}
              isPending={markItemReceived.isPending}
              onOpenChange={(open) => !open && setItemToMarkReceived(null)}
              description={
                <>
                  Xác nhận kho đã nhận sản phẩm trả về cho yêu cầu{" "}
                  <span className="font-medium text-foreground">
                    {itemToMarkReceived?.code}
                  </span>
                  .
                </>
              }
            />

            <ProcessRefundDialog
              item={itemToRefund}
              onOpenChange={(open) => !open && setItemToRefund(null)}
            />

            <ConfirmActionDialog
              confirmLabel="Hoàn tất"
              icon={<Flag />}
              pendingLabel="Đang xử lý..."
              open={!!itemToComplete}
              title="Hoàn tất yêu cầu đổi trả?"
              onConfirm={handleConfirmComplete}
              isPending={completeReturnRequest.isPending}
              onOpenChange={(open) => !open && setItemToComplete(null)}
              description={
                <>
                  Đánh dấu yêu cầu{" "}
                  <span className="font-medium text-foreground">
                    {itemToComplete?.code}
                  </span>{" "}
                  đã hoàn tất toàn bộ quy trình.
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReturnRequests;
