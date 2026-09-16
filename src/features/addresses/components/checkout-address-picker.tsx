"use client";

import { useState } from "react";

import { Check, Plus, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddressFormDialog } from "./address-form-dialog";

import { cn } from "@/lib/utils";
import { Address } from "@/types/address";
import { formatAddress, formatPhone } from "../utils/format-address";

interface CheckoutAddressPickerProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
  onUseManual: () => void;
}

export function CheckoutAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onUseManual,
}: CheckoutAddressPickerProps) {
  const [formOpen, setFormOpen] = useState(false);

  if (addresses.length === 0) return null;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Địa chỉ đã lưu</h2>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="size-4" />
          Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = address.id === selectedId;

          return (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-secondary ring-3 ring-secondary/20"
                  : "border-border hover:border-secondary/50",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-muted-foreground/40",
                )}
              >
                {isSelected ? <Check className="size-3" /> : null}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-medium">{address.recipientName}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatPhone(address.recipientPhone)}
                  </span>
                  {address.isDefault ? (
                    <span className="rounded-full bg-secondary/10 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                      Mặc định
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {formatAddress(address)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onUseManual}
        className={cn(
          "flex items-center gap-1.5 text-xs underline transition",
          selectedId === null
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <PencilLine className="size-3.5" />
        Giao tới một địa chỉ khác (chỉ cho đơn này)
      </button>

      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isFirstAddress={false}
      />
    </div>
  );
}
