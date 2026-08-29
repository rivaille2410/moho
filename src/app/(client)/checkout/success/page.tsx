import { Suspense } from "react";

import { CheckoutSuccessContent } from "./_components/checkout-success-content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
