"use client";

import { usePathname } from "next/navigation";

import { useBreadcrumbOverrides } from "@/lib/breadcrumb-store";

import {
  PageBreadcrumb,
  type BreadcrumbItemData,
} from "@/components/shared/page-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Quản lý người dùng",
  products: "Quản lý sản phẩm",
  categories: "Quản lý danh mục",
  reviews: "Quản lý đánh giá",
};

function buildBreadcrumbItems(
  pathname: string,
  overrides: Record<string, string>,
): BreadcrumbItemData[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = overrides[href] ?? ROUTE_LABELS[segment] ?? segment;

    return { label, href };
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const overrides = useBreadcrumbOverrides();
  const items = buildBreadcrumbItems(pathname, overrides);

  return (
    <header className="h-(--header-height) shrink-0 flex items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="w-full flex items-center gap-1 lg:gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="h-4 data-vertical:self-auto mx-2"
        />
        <PageBreadcrumb items={items} />
      </div>
    </header>
  );
}
