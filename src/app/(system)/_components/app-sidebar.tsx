"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  TagsIcon,
  UsersIcon,
  PackageIcon,
  LayoutDashboardIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quản lý người dùng",
      url: "/dashboard/users",
      icon: <UsersIcon />,
    },
    {
      title: "Quản lý danh mục",
      url: "/dashboard/categories",
      icon: <TagsIcon />,
    },
    {
      title: "Quản lý sản phẩm",
      url: "/dashboard/products",
      icon: <PackageIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              className="data-[slot=sidebar-menu-button]:p-1.5! h-fit"
            >
              <Image src={"/logo.png"} alt="Logo" width={140} height={140} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar ?? "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
