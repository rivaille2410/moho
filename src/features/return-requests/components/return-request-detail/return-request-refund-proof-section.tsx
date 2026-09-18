"use client";

import Link from "next/link";
import Image from "next/image";

import { ZoomIn } from "lucide-react";

import { ReturnRequest } from "@/types/return-request";

export function ReturnRequestRefundProofSection({
  returnRequest,
}: {
  returnRequest: ReturnRequest;
}) {
  if (!returnRequest.refundProofImageUrl) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <h3 className="text-sm font-medium">Ảnh chứng minh đã hoàn tiền</h3>
      <Link
        href={returnRequest.refundProofImageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-square w-full overflow-hidden rounded-lg border"
      >
        <Image
          src={returnRequest.refundProofImageUrl}
          alt="Ảnh chứng minh đã hoàn tiền"
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
          <ZoomIn className="size-6 text-white" />
        </div>
      </Link>
    </div>
  );
}
