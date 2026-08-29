import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán | MOHO",
  description:
    "Điền thông tin giao hàng và chọn phương thức thanh toán để hoàn tất đơn hàng tại MOHO.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
