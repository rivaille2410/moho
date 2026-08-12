import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { VerifyEmailContent } from "./_components/verify-email-content";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-5 text-center">
        <div className="size-16 shrink-0 flex items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <Spinner className="size-6" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold">Đang xác thực email</h1>
          <p className="text-sm text-muted-foreground">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    </div>
  );
}
