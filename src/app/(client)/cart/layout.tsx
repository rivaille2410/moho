import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng | MOHO",
  description:
    "Xem lại các sản phẩm trong giỏ hàng, điều chỉnh số lượng và tiến hành thanh toán tại MOHO.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
