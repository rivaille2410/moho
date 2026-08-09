import Image from "next/image";

import { ChevronDown, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthModal } from "@/features/auth/components/auth-modal";

export const Header = () => {
  return (
    <header className="wrapper h-16.25 flex items-center justify-between">
      <Image src={"/logo.png"} alt="Logo" width={140} height={140} />

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
    </header>
  );
};
