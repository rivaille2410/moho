"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import {
  type LoginValues,
  type RegisterValues,
  type ForgotPasswordValues,
} from "@/schemas/auth";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";

interface AuthModalProps {
  children: React.ReactElement | React.ReactElement[];
}

export type AuthView = "login" | "register" | "forgot-password";

export const AUTH_VIEW_CONTENT: Record<
  AuthView,
  { title: string; description: string }
> = {
  login: {
    title: "Đăng nhập tài khoản",
    description: "Nhập email và mật khẩu của bạn để đăng nhập",
  },
  register: {
    title: "Tạo tài khoản mới",
    description: "Điền thông tin bên dưới để đăng ký tài khoản",
  },
  "forgot-password": {
    title: "Khôi phục mật khẩu",
    description: "Nhập email để nhận liên kết đặt lại mật khẩu",
  },
};

export const AuthModal = ({ children }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>("login");
  const { title, description } = AUTH_VIEW_CONTENT[view];

  const triggers = Array.isArray(children) ? children : [children];

  const handleLogin = (values: LoginValues) => {
    console.log("login", values);
  };

  const handleRegister = (values: RegisterValues) => {
    console.log("register", values);
  };

  const handleForgotPassword = (values: ForgotPasswordValues) => {
    console.log("forgot-password", values);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setView("login");
      }}
    >
      {triggers.map((trigger, index) => (
        <DialogTrigger key={index} render={trigger} />
      ))}

      <DialogContent className="sm:min-w-120 flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {view !== "forgot-password" && (
          <>
            <Button size={"lg"} variant={"outline"} className="gap-2">
              <Image src={"/google.svg"} alt="Google" width={18} height={18} />
              <p>Tiếp tục với Google</p>
            </Button>

            <div className="relative">
              <Separator />
              <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-3 text-xs text-muted-foreground bg-background">
                Hoặc
              </p>
            </div>
          </>
        )}

        {view === "login" && <LoginForm onSubmit={handleLogin} />}
        {view === "register" && <RegisterForm onSubmit={handleRegister} />}
        {view === "forgot-password" && (
          <ForgotPasswordForm onSubmit={handleForgotPassword} />
        )}

        <div className="flex flex-col gap-3">
          {view === "login" && (
            <>
              <div className="flex items-center justify-center gap-1">
                <p className="text-muted-foreground">Chưa có tài khoản?</p>
                <button
                  onClick={() => setView("register")}
                  className="hover:text-secondary transition"
                >
                  Đăng ký ngay!
                </button>
              </div>

              <div className="flex items-center justify-center gap-1">
                <p className="text-muted-foreground">Quên mật khẩu?</p>
                <button
                  onClick={() => setView("forgot-password")}
                  className="hover:text-secondary transition"
                >
                  Khôi phục mật khẩu!
                </button>
              </div>
            </>
          )}

          {view === "register" && (
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground">Đã có tài khoản?</p>
              <button
                onClick={() => setView("login")}
                className="hover:text-secondary transition"
              >
                Đăng nhập ngay!
              </button>
            </div>
          )}

          {view === "forgot-password" && (
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground">Đã nhớ mật khẩu?</p>
              <button
                onClick={() => setView("login")}
                className="hover:text-secondary transition"
              >
                Quay lại đăng nhập!
              </button>
            </div>
          )}
        </div>

        {view !== "forgot-password" && (
          <DialogFooter>
            <p className="text-[13px] text-muted-foreground text-center">
              Bằng việc tiếp tục, bạn đồng ý với{" "}
              <Link
                href="/"
                className="underline hover:text-secondary transition"
              >
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link
                href="/"
                className="underline hover:text-secondary transition"
              >
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
