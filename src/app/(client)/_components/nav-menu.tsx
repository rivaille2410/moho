"use client";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import {
  Menubar,
  MenubarSub,
  MenubarMenu,
  MenubarItem,
  MenubarContent,
  MenubarTrigger,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";

import {
  useCategoryMenu,
  type CategoryMenuItem,
} from "@/features/categories/hooks/use-category-menu";

const promoLinks = [
  { label: "Đang diễn ra", href: "/promotions/ongoing" },
  { label: "Sắp diễn ra", href: "/promotions/upcoming" },
];

const newsLinks = [
  { label: "Tin nội thất", href: "/news/furniture" },
  { label: "Xu hướng thiết kế", href: "/news/design-trends" },
];

function CategoryMenuNode({ item }: { item: CategoryMenuItem }) {
  if (item.children.length === 0) {
    return (
      <MenubarItem render={<Link href={item.href} />}>{item.name}</MenubarItem>
    );
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>{item.name}</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem render={<Link href={item.href} />}>
          Tất cả {item.name}
        </MenubarItem>
        {item.children.map((child) => (
          <CategoryMenuNode key={child.id} item={child} />
        ))}
      </MenubarSubContent>
    </MenubarSub>
  );
}

export const NavMenu = () => {
  const { items: categories, isLoading } = useCategoryMenu();

  return (
    <nav className="wrapper hidden w-full items-center bg-background md:flex">
      <Menubar className="h-11 gap-3 border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="gap-1 font-medium">
            Sản phẩm
            <ChevronDown className="size-3.5" />
          </MenubarTrigger>
          <MenubarContent align="start" className="w-56">
            <MenubarItem render={<Link href="/products" />}>
              Tất cả sản phẩm
            </MenubarItem>

            {isLoading ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                Đang tải danh mục...
              </p>
            ) : (
              categories.map((category) => (
                <CategoryMenuNode key={category.id} item={category} />
              ))
            )}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1 font-medium">
            Khuyến mãi
            <ChevronDown className="size-3.5" />
          </MenubarTrigger>
          <MenubarContent align="start">
            {promoLinks.map((item) => (
              <MenubarItem key={item.href} render={<Link href={item.href} />}>
                {item.label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="gap-1 font-medium">
            Tin tức
            <ChevronDown className="size-3.5" />
          </MenubarTrigger>
          <MenubarContent align="start">
            {newsLinks.map((item) => (
              <MenubarItem key={item.href} render={<Link href={item.href} />}>
                {item.label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="font-medium">
            <Link href="/about">Về MOHO</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="font-medium">
            <Link href="/stores">Cửa hàng</Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
};
