import Link from "next/link";
import Image from "next/image";

import { type ReturnRequest } from "@/types/return-request";

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

interface Props {
  returnRequest: ReturnRequest;
}

export function ReturnRequestItemsSection({ returnRequest }: Props) {
  const totalRefund = returnRequest.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  return (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">
          Sản phẩm hoàn trả ({returnRequest.items.length})
        </h2>
      </div>

      <div className="divide-y">
        {returnRequest.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <Link
              href={`/dashbard/products/${item.id}`}
              className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted"
            >
              {item.thumbnailUrl ? (
                <Image
                  fill
                  sizes="64px"
                  src={item.thumbnailUrl}
                  alt={item.productName}
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.productSlug}`}
                className="line-clamp-1 text-sm font-medium hover:text-secondary transition"
              >
                {item.productName}
              </Link>

              <div className="mt-1 flex items-center gap-3 text-[13px] text-muted-foreground">
                {item.colorHex ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    {item.colorName ?? item.variantName}
                  </span>
                ) : (
                  <span>{item.variantName}</span>
                )}
                <span>Số lượng: {item.quantity}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[17px] font-semibold text-secondary">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {formatPrice(item.unitPrice)} / sản phẩm
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
