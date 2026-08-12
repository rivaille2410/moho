"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  LogOut,
  UserRound,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

import { authRequest } from "@/lib/auth-request";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useCurrentUser();

  const handleLogout = async () => {
    const result = await authRequest({
      url: "/api/auth/logout",
      successMessage: "Đăng xuất thành công.",
    });

    if (result.ok) {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    }
  };

  return (
    <header className="wrapper sticky top-0 w-full h-13.75 flex items-center justify-between bg-background z-50">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="Logo" width={140} height={140} />
      </Link>

      {isLoading ? (
        <Spinner className="size-5 text-secondary" />
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size={"lg"}
                variant={"ghost"}
                className="h-fit py-1 px-2 gap-2"
              >
                <Avatar className="size-8.5">
                  <AvatarImage src={user.avatar ?? ""} alt={user.name} />
                  <AvatarFallback className="size-8.5">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-start hidden md:block">
                  <p>{user.name}</p>
                  <p className="flex items-center gap-1 font-normal text-xs text-muted-foreground">
                    Tài khoản của tôi <ChevronDown className="size-3.5" />
                  </p>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {user.role === "ADMIN" && (
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="size-4" />
                Hồ sơ
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="size-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <AuthModal>
          {[
            <Button
              size={"lg"}
              variant={"ghost"}
              key="desktop-trigger"
              className="hidden md:flex h-fit py-1 px-2 gap-2"
            >
              <UserRound className="size-6" />
              <div className="text-start">
                <p>Đăng nhập / Đăng ký</p>
                <p className="flex items-center gap-1 font-normal">
                  Tài khoản của tôi <ChevronDown className="size-3.5" />
                </p>
              </div>
            </Button>,
            <Button
              size={"icon-xl"}
              variant={"ghost"}
              key="mobile-trigger"
              className="flex md:hidden"
            >
              <UserRound className="size-6" />
            </Button>,
          ]}
        </AuthModal>
      )}
    </header>
  );
};
