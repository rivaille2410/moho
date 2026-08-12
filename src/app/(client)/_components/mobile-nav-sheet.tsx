"use client";

import Link from "next/link";
import { useState } from "react";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

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

export const MobileNavSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Danh mục</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          <Accordion className="w-full">
            <AccordionItem value="san-pham">
              <AccordionTrigger className="text-sm font-medium">
                Sản phẩm
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 ps-2">
                  {productCategories.map((category) =>
                    category.children ? (
                      <div key={category.label} className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {category.label}
                        </span>
                        <div className="flex flex-col gap-2 ps-3">
                          {category.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="text-sm"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={category.href}
                        href={category.href!}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium"
                      >
                        {category.label}
                      </Link>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="khuyen-mai">
              <AccordionTrigger className="text-sm font-medium">
                Khuyến mãi
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 ps-2">
                  {promoLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tin-tuc">
              <AccordionTrigger className="text-sm font-medium">
                Tin tức
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 ps-2">
                  {newsLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href="/ve-moho"
            onClick={() => setOpen(false)}
            className="border-t py-3 text-sm font-medium"
          >
            Về MOHO
          </Link>
          <Link
            href="/cua-hang"
            onClick={() => setOpen(false)}
            className="border-t py-3 text-sm font-medium"
          >
            Cửa hàng
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
