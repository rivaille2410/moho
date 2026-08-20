"use client";

import * as React from "react";

import { type ReactTable } from "@tanstack/react-table";
import { ShieldBanIcon, Trash2Icon } from "lucide-react";

import { getColumns } from "@/features/users/components/columns";
import { EditRoleDialog } from "@/features/users/components/edit-role-dialog";
import { UsersTableToolbar } from "@/features/users/components/users-table-toolbar";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useBanUser } from "@/features/users/hooks/use-ban-user";
import { useUnbanUser } from "@/features/users/hooks/use-unban-user";
import { useDeleteUser } from "@/features/users/hooks/use-delete-user";
import { useChangeRole } from "@/features/users/hooks/use-change-role";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUsers, type UserListItem } from "@/features/users/hooks/use-users";
import { useBulkDeleteUsers } from "@/features/users/hooks/use-bulk-delete-users";

import { DataTable } from "@/components/data-table/data-table";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { type DataTableFeatures } from "@/components/data-table/data-table-features";

const DashboardUsers = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<string | undefined>(undefined);
  const [emailVerified, setEmailVerified] = React.useState<boolean | undefined>(
    undefined,
  );
  const [banned, setBanned] = React.useState<boolean | undefined>(undefined);
  const [userToDelete, setUserToDelete] = React.useState<UserListItem | null>(
    null,
  );
  const [userToEditRole, setUserToEditRole] =
    React.useState<UserListItem | null>(null);
  const [userToBan, setUserToBan] = React.useState<UserListItem | null>(null);
  const [usersToBulkDelete, setUsersToBulkDelete] = React.useState<
    UserListItem[] | null
  >(null);

  const tableRef = React.useRef<ReactTable<
    DataTableFeatures,
    UserListItem
  > | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useUsers({
    page,
    role,
    limit,
    banned,
    emailVerified,
    search: debouncedSearch || undefined,
  });

  const { data: currentUser } = useCurrentUser();

  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const deleteUser = useDeleteUser();
  const changeRole = useChangeRole();
  const bulkDeleteUsers = useBulkDeleteUsers();

  const columns = React.useMemo(
    () =>
      getColumns({
        currentUserId: currentUser?.id,
        onBan: (user: UserListItem) => setUserToBan(user),
        onDelete: (user: UserListItem) => setUserToDelete(user),
        onUnban: (user: UserListItem) => unbanUser.mutate(user.id),
        onEditRole: (user: UserListItem) => setUserToEditRole(user),
      }),
    [currentUser?.id, unbanUser],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value: string | undefined) => {
    setRole(value);
    setPage(1);
  };

  const handleEmailVerifiedChange = (value: boolean | undefined) => {
    setEmailVerified(value);
    setPage(1);
  };

  const handleBannedChange = (value: boolean | undefined) => {
    setBanned(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => setUserToDelete(null),
    });
  };

  const handleConfirmChangeRole = (newRole: string) => {
    if (!userToEditRole) return;

    changeRole.mutate(
      { id: userToEditRole.id, role: newRole },
      { onSuccess: () => setUserToEditRole(null) },
    );
  };

  const handleConfirmBan = () => {
    if (!userToBan) return;

    banUser.mutate(userToBan.id, {
      onSuccess: () => setUserToBan(null),
    });
  };

  const handleConfirmBulkDelete = () => {
    if (!usersToBulkDelete) return;

    bulkDeleteUsers.mutate(
      usersToBulkDelete.map((user) => user.id),
      {
        onSuccess: () => {
          setUsersToBulkDelete(null);
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
                  <UsersTableToolbar
                    role={role}
                    table={table}
                    search={search}
                    banned={banned}
                    emailVerified={emailVerified}
                    onRoleChange={handleRoleChange}
                    onSearchChange={handleSearchChange}
                    onBannedChange={handleBannedChange}
                    onEmailVerifiedChange={handleEmailVerifiedChange}
                    onBulkDelete={(users) => setUsersToBulkDelete(users)}
                  />
                );
              }}
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              open={!!userToDelete}
              icon={<Trash2Icon />}
              variant="destructive"
              title="Xoá người dùng?"
              pendingLabel="Đang xoá..."
              onConfirm={handleConfirmDelete}
              isPending={deleteUser.isPending}
              onOpenChange={(open) => !open && setUserToDelete(null)}
              description={
                <>
                  Bạn sắp xoá vĩnh viễn tài khoản{" "}
                  <span className="font-medium text-foreground">
                    {userToDelete?.name}
                  </span>{" "}
                  ({userToDelete?.email}). Hành động này không thể hoàn tác.
                </>
              }
            />

            <ConfirmActionDialog
              open={!!userToBan}
              confirmLabel="Khoá"
              variant="destructive"
              title="Khoá tài khoản?"
              icon={<ShieldBanIcon />}
              pendingLabel="Đang khoá..."
              onConfirm={handleConfirmBan}
              isPending={banUser.isPending}
              onOpenChange={(open) => !open && setUserToBan(null)}
              description={
                <>
                  Tài khoản{" "}
                  <span className="font-medium text-foreground">
                    {userToBan?.name}
                  </span>{" "}
                  ({userToBan?.email}) sẽ không thể đăng nhập cho đến khi được
                  mở khoá.
                </>
              }
            />

            <ConfirmActionDialog
              confirmLabel="Xoá"
              icon={<Trash2Icon />}
              variant="destructive"
              pendingLabel="Đang xoá..."
              open={!!usersToBulkDelete}
              onConfirm={handleConfirmBulkDelete}
              isPending={bulkDeleteUsers.isPending}
              title={`Xoá ${usersToBulkDelete?.length ?? 0} người dùng?`}
              onOpenChange={(open) => !open && setUsersToBulkDelete(null)}
              description={
                <>
                  Bạn sắp xoá vĩnh viễn{" "}
                  <span className="font-medium text-foreground">
                    {usersToBulkDelete?.length ?? 0} tài khoản
                  </span>{" "}
                  đã chọn. Hành động này không thể hoàn tác.
                </>
              }
            />

            <EditRoleDialog
              user={userToEditRole}
              isPending={changeRole.isPending}
              onConfirm={handleConfirmChangeRole}
              onOpenChange={(open) => !open && setUserToEditRole(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
