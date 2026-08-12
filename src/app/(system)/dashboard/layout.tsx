import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MOHO Admin",
  description: "Tổng quan số liệu và hoạt động hệ thống Moho.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
