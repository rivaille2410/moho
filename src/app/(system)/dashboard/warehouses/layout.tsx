import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý kho hàng | MOHO Admin",
  description: "Quản lý danh sách kho hàng trong hệ thống.",
};

export default function WarehousesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
