import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yêu cầu đổi trả | MOHO Admin",
  description:
    "Quản lý, duyệt và xử lý các yêu cầu đổi trả, hoàn tiền từ khách hàng.",
};

export default function ReturnRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
