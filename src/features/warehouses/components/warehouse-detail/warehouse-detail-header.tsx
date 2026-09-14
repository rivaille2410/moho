import Link from "next/link";

import { ArrowLeft, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Warehouse } from "@/types/warehouse";

interface Props {
  warehouse: Warehouse;
}

function formatAddress(warehouse: Warehouse) {
  const parts = [
    warehouse.addressDetail,
    warehouse.wardName,
    warehouse.provinceName,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}

export function WarehouseDetailHeader({ warehouse }: Props) {
  const address = formatAddress(warehouse);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/warehouses"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách kho hàng
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {warehouse.name}
          </h1>
          {warehouse.isMain && (
            <Badge variant="secondary" className="gap-1">
              <Star className="size-3" />
              Kho chính
            </Badge>
          )}
        </div>
        {address && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {address}
          </span>
        )}
      </div>
    </div>
  );
}
