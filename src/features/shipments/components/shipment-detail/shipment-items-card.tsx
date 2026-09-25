import Image from "next/image";

import { ShipmentItem } from "@/types/shipment";

interface Props {
  items: ShipmentItem[];
}

export function ShipmentItemsCard({ items }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <h2 className="text-sm font-medium">Sản phẩm trong vận đơn</h2>

      <div className="flex flex-col divide-y">
        {items.map((item) => (
          <div
            key={item.orderItemId}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
              {item.thumbnailUrl && (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {item.variantName}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              {item.quantity}/{item.orderedQuantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
