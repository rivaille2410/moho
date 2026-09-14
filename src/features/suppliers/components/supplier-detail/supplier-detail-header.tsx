import Link from "next/link";

import { ArrowLeft, Mail, MapPin } from "lucide-react";

import { Supplier } from "@/types/supplier";

interface Props {
  supplier: Supplier;
}

function formatAddress(supplier: Supplier) {
  const parts = [
    supplier.addressDetail,
    supplier.wardName,
    supplier.provinceName,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}

export function SupplierDetailHeader({ supplier }: Props) {
  const address = formatAddress(supplier);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/suppliers"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách nhà cung cấp
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {supplier.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {supplier.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3.5" />
              {supplier.email}
            </span>
          )}
          {address && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {address}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
