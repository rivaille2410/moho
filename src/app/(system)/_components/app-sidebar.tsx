"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  TagsIcon,
  StarIcon,
  SendIcon,
  Undo2Icon,
  UsersIcon,
  TruckIcon,
  TicketIcon,
  PackageIcon,
  ReceiptIcon,
  FileTextIcon,
  WarehouseIcon,
  ClipboardListIcon,
  ArrowLeftRightIcon,
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
      label: "Hệ thống",
      items: [
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
      ],
    },
    {
      label: "Nội dung",
      items: [
        {
          title: "Quản lý danh mục",
          url: "/dashboard/categories",
          icon: <TagsIcon />,
        },
        {
          title: "Quản lý bài viết",
          url: "/dashboard/posts",
          icon: <FileTextIcon />,
        },
      ],
    },
    {
      label: "Sản phẩm",
      items: [
        {
          title: "Quản lý sản phẩm",
          url: "/dashboard/products",
          icon: <PackageIcon />,
        },
        {
          title: "Quản lý đánh giá",
          url: "/dashboard/reviews",
          icon: <StarIcon />,
        },
      ],
    },
    {
      label: "Bán hàng",
      items: [
        {
          title: "Quản lý đơn hàng",
          url: "/dashboard/orders",
          icon: <ReceiptIcon />,
        },
        {
          title: "Quản lý vận đơn",
          url: "/dashboard/shipments",
          icon: <SendIcon />,
        },
        {
          title: "Yêu cầu đổi trả",
          url: "/dashboard/return-requests",
          icon: <Undo2Icon />,
        },
        {
          title: "Quản lý voucher",
          url: "/dashboard/vouchers",
          icon: <TicketIcon />,
        },
      ],
    },
    {
      label: "Kho hàng",
      items: [
        {
          title: "Đơn nhập hàng",
          url: "/dashboard/purchase-orders",
          icon: <ClipboardListIcon />,
        },
        {
          title: "Lịch sử tồn kho",
          url: "/dashboard/stock-movements",
          icon: <ArrowLeftRightIcon />,
        },
        {
          title: "Nhà cung cấp",
          url: "/dashboard/suppliers",
          icon: <TruckIcon />,
        },
        {
          title: "Kho hàng",
          url: "/dashboard/warehouses",
          icon: <WarehouseIcon />,
        },
      ],
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
        <NavMain groups={data.navMain} pathname={pathname} />
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
