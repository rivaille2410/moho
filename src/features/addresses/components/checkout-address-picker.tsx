"use client";

import { useState } from "react";
import { Check, PencilLine, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddressFormDialog } from "./address-form-dialog";
import { cn } from "@/lib/utils";
import { Address } from "@/types/address";
import { formatAddress, formatPhone } from "../utils/format-address";
import { useDeleteAddress } from "../hooks/use-delete-address";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

interface CheckoutAddressPickerProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
  onDeleted: (address: Address) => void;
}

export function CheckoutAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onDeleted,
}: CheckoutAddressPickerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const deleteAddress = useDeleteAddress();

  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => {
            setEditingAddress(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          {addresses.length ? "Thêm mới" : "Thêm địa chỉ"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {addresses.map((address) => {
            const isSelected = address.id === selectedId;

            return (
              <div
                key={address.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-2 transition",
                  isSelected
                    ? "border-secondary ring-3 ring-secondary/20"
                    : "border-border hover:border-secondary/50",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(address)}
                  aria-pressed={isSelected}
                  className="flex min-w-0 flex-1 items-start gap-3 p-1 text-left"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected ? <Check className="size-3" /> : null}
                  </span>

                  <span className="min-w-0 space-y-0.5">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium">
                        {address.recipientName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatPhone(address.recipientPhone)}
                      </span>
                      {address.isDefault ? (
                        <span className="rounded-full bg-secondary/10 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                          Mặc định
                        </span>
                      ) : null}
                    </span>
                    <span className="block line-clamp-2 text-xs text-muted-foreground">
                      {formatAddress(address)}
                    </span>
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Sửa địa chỉ ${address.recipientName}`}
                  onClick={() => {
                    setEditingAddress(address);
                    setFormOpen(true);
                  }}
                >
                  <PencilLine className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Xóa địa chỉ ${address.recipientName}`}
                  disabled={deleteAddress.isPending}
                  onClick={() => setDeletingAddress(address)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            );
        })}
      </div>

      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
        isFirstAddress={addresses.length === 0}
        onAddressCreated={onSelect}
      />

      <ConfirmActionDialog
        open={Boolean(deletingAddress)}
        onOpenChange={(open) => {
          if (!open) setDeletingAddress(null);
        }}
        icon={<Trash2 className="size-5" />}
        title="Xóa địa chỉ này?"
        description={deletingAddress ? formatAddress(deletingAddress) : null}
        confirmLabel="Xóa"
        pendingLabel="Đang xóa..."
        isPending={deleteAddress.isPending}
        variant="destructive"
        onConfirm={() => {
          if (!deletingAddress) return;
          deleteAddress.mutate(deletingAddress.id, {
            onSuccess: () => {
              onDeleted(deletingAddress);
              setDeletingAddress(null);
            },
          });
        }}
      />
    </div>
  );
}
