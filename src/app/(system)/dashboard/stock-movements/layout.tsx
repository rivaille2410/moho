import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử tồn kho | MOHO Admin",
  description: "Theo dõi lịch sử nhập, xuất và điều chỉnh tồn kho.",
};

export default function StockMovementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
