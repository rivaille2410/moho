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

const productCategories = [
  { label: "Bộ Sưu Tập", href: "/bo-suu-tap" },
  {
    label: "Phòng Ngủ",
    children: [
      { label: "Giường ngủ", href: "/phong-ngu/giuong" },
      { label: "Tủ quần áo", href: "/phong-ngu/tu-quan-ao" },
      { label: "Bàn trang điểm", href: "/phong-ngu/ban-trang-diem" },
    ],
  },
  {
    label: "Phòng Khách",
    children: [
      { label: "Sofa", href: "/phong-khach/sofa" },
      { label: "Bàn trà", href: "/phong-khach/ban-tra" },
      { label: "Kệ tivi", href: "/phong-khach/ke-tivi" },
    ],
  },
  {
    label: "Phòng Ăn",
    children: [
      { label: "Bàn ăn", href: "/phong-an/ban-an" },
      { label: "Ghế ăn", href: "/phong-an/ghe-an" },
    ],
  },
  {
    label: "Phòng Làm Việc",
    children: [
      { label: "Bàn làm việc", href: "/phong-lam-viec/ban" },
      { label: "Ghế văn phòng", href: "/phong-lam-viec/ghe" },
    ],
  },
  { label: "Tủ Bếp", href: "/tu-bep" },
  { label: "Nệm", href: "/nem" },
];

const promoLinks = [
  { label: "Đang diễn ra", href: "/khuyen-mai/dang-dien-ra" },
  { label: "Sắp diễn ra", href: "/khuyen-mai/sap-dien-ra" },
];

const newsLinks = [
  { label: "Tin nội thất", href: "/tin-tuc/noi-that" },
  { label: "Xu hướng thiết kế", href: "/tin-tuc/xu-huong" },
];

export const NavMenu = () => {
  return (
    <nav className="wrapper hidden w-full items-center border-b bg-background md:flex">
      <Menubar className="h-11 gap-3 border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="gap-1 font-medium">
            Sản phẩm
            <ChevronDown className="size-3.5" />
          </MenubarTrigger>
          <MenubarContent align="start" className="w-56">
            {productCategories.map((category) =>
              category.children ? (
                <MenubarSub key={category.label}>
                  <MenubarSubTrigger>{category.label}</MenubarSubTrigger>
                  <MenubarSubContent>
                    {category.children.map((child) => (
                      <MenubarItem key={child.href}>
                        <Link href={child.href}>{child.label}</Link>
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              ) : (
                <MenubarItem key={category.href}>
                  <Link href={category.href!}>{category.label}</Link>
                </MenubarItem>
              ),
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
              <MenubarItem key={item.href}>
                <Link href={item.href}>{item.label}</Link>
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
              <MenubarItem key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="font-medium">
            <Link href="/ve-moho">Về MOHO</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="font-medium">
            <Link href="/cua-hang">Cửa hàng</Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
};
