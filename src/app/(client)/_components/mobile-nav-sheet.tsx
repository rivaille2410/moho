"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Info,
  Menu,
  Store,
  Newspaper,
  LayoutGrid,
  ChevronDown,
  BadgePercent,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import {
  useCategoryMenu,
  type CategoryMenuItem,
} from "@/features/categories/hooks/use-category-menu";

const promoLinks = [
  { label: "Đang diễn ra", href: "/khuyen-mai/dang-dien-ra" },
  { label: "Sắp diễn ra", href: "/khuyen-mai/sap-dien-ra" },
];

const newsLinks = [
  { label: "Tin nội thất", href: "/tin-tuc/noi-that" },
  { label: "Xu hướng thiết kế", href: "/tin-tuc/xu-huong" },
];

function Collapse({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div
        aria-hidden={!open}
        className={cn(
          "overflow-hidden transition-[visibility] duration-300",
          !open && "invisible",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
      <Icon className="size-4.5" />
    </span>
  );
}

function NavLink({
  href,
  label,
  icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/60 active:bg-muted",
        isActive && "bg-secondary/10 text-secondary",
      )}
    >
      <IconBadge icon={icon} />
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function NavSection({
  label,
  icon,
  children,
  defaultOpen = false,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted/60 active:bg-muted"
      >
        <IconBadge icon={icon} />
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <Collapse open={open}>
        <div className="ml-7 border-l pb-2 pl-3 pt-1">{children}</div>
      </Collapse>
    </div>
  );
}

function SubLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-lg py-2.5 pl-3 pr-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      {label}
    </Link>
  );
}

function CategoryNode({
  item,
  depth = 0,
  onNavigate,
}: {
  item: CategoryMenuItem;
  depth?: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <div>
      <div className="flex items-center rounded-lg transition-colors hover:bg-muted/60">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex-1 py-2.5 pl-3 pr-2 text-sm",
            depth === 0 ? "font-medium" : "text-muted-foreground",
          )}
        >
          {item.name}
        </Link>

        {hasChildren && (
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "Thu gọn" : "Mở rộng"} ${item.name}`}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <Collapse open={open}>
          <div className="ml-3 border-l pl-1">
            {item.children.map((child) => (
              <CategoryNode
                key={child.id}
                item={child}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-2 py-1 pl-3" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-3/4 rounded-md" />
      ))}
    </div>
  );
}

export const MobileNavSheet = () => {
  const [open, setOpen] = useState(false);
  const { items: categories, isLoading } = useCategoryMenu();

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="flex w-[85%] max-w-sm flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b bg-secondary/5 px-5 py-5 gap-3">
          <Link href={"/"}>
            <Image src={"/logo.png"} alt="Logo" width={140} height={140} />
          </Link>
          <SheetDescription className="text-sm">
            Khám phá danh mục sản phẩm
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-0.5">
            <NavSection defaultOpen icon={LayoutGrid} label="Sản phẩm">
              {isLoading ? (
                <CategorySkeleton />
              ) : (
                categories.map((category) => (
                  <CategoryNode
                    key={category.id}
                    item={category}
                    onNavigate={close}
                  />
                ))
              )}
            </NavSection>

            <NavSection icon={BadgePercent} label="Khuyến mãi">
              {promoLinks.map((item) => (
                <SubLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onNavigate={close}
                />
              ))}
            </NavSection>

            <NavSection icon={Newspaper} label="Tin tức">
              {newsLinks.map((item) => (
                <SubLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onNavigate={close}
                />
              ))}
            </NavSection>
          </div>

          <div className="my-3 border-t" />

          <div className="flex flex-col gap-0.5">
            <NavLink
              icon={Info}
              href="/ve-moho"
              label="Về MOHO"
              onNavigate={close}
            />
            <NavLink
              icon={Store}
              label="Cửa hàng"
              href="/cua-hang"
              onNavigate={close}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
