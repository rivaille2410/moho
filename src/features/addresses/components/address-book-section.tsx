"use client";

import { useState } from "react";

import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Address } from "@/types/address";

import { AddressFormDialog } from "./address-form-dialog";
import { formatAddress, formatPhone } from "../utils/format-address";

import { useAddresses } from "../hooks/use-addresses";
import { useDeleteAddress } from "../hooks/use-delete-address";
import { useSetDefaultAddress } from "../hooks/use-set-default-address";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { Badge } from "@/components/ui/badge";

const MAX_ADDRESSES = 10;

export function AddressBookSection() {
  const { data, isLoading, isError } = useAddresses();
  const addresses = data?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);

  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteAddress.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Không thể tải danh sách địa chỉ. Vui lòng thử lại.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Đã lưu {addresses.length}/{MAX_ADDRESSES} địa chỉ
        </p>
        <Button
          size="lg"
          className="gap-2"
          onClick={openCreate}
          disabled={addresses.length >= MAX_ADDRESSES}
        >
          <Plus className="size-4" />
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <MapPin
            className="size-12 text-muted-foreground/40"
            strokeWidth={1.5}
          />
          <p className="text-sm text-muted-foreground">
            Bạn chưa lưu địa chỉ nào. Thêm địa chỉ để thanh toán nhanh hơn.
          </p>
          <Button size="lg" onClick={openCreate} className="gap-2">
            <Plus className="size-4" />
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "rounded-lg border p-4 transition",
                address.isDefault &&
                  "border-secondary ring-[3px] ring-secondary/30 bg-secondary/5",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{address.recipientName}</p>
                    <span className="text-muted-foreground">|</span>
                    <p className="text-sm text-muted-foreground">
                      {formatPhone(address.recipientPhone)}
                    </p>
                    {address.isDefault ? (
                      <Badge variant="secondary">
                        <Star className="size-3" />
                        Mặc định
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatAddress(address)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {!address.isDefault ? (
                    <Button
                      size="xl"
                      variant="ghost"
                      disabled={setDefaultAddress.isPending}
                      onClick={() => setDefaultAddress.mutate(address.id)}
                    >
                      Đặt mặc định
                    </Button>
                  ) : null}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Sửa địa chỉ"
                    onClick={() => openEdit(address)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    aria-label="Xoá địa chỉ"
                    onClick={() => setDeleting(address)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormDialog
        open={formOpen}
        address={editing}
        onOpenChange={setFormOpen}
        isFirstAddress={!editing && addresses.length === 0}
      />

      <ConfirmActionDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        icon={<Trash2 className="size-5" />}
        title="Xoá địa chỉ này?"
        description={
          <>
            {deleting ? formatAddress(deleting) : null}
            {deleting?.isDefault
              ? " — Đây là địa chỉ mặc định, một địa chỉ khác sẽ được chọn thay thế."
              : null}
          </>
        }
        confirmLabel="Xoá"
        pendingLabel="Đang xoá..."
        isPending={deleteAddress.isPending}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
