import Link from "next/link";
import Image from "next/image";

import { type ReturnRequest } from "@/types/return-request";

interface Props {
  returnRequest: ReturnRequest;
}

export function ReturnRequestImagesSection({ returnRequest }: Props) {
  if (returnRequest.images.length === 0) return null;

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-semibold">
        Hình ảnh minh chứng ({returnRequest.images.length})
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {returnRequest.images.map((url) => (
          <Link
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square overflow-hidden rounded-md border bg-muted"
          >
            <Image
              fill
              src={url}
              alt="Ảnh minh chứng"
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
