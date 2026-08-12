"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Mail, KeyRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  type LoginValues,
  type RegisterValues,
  type ResetPasswordValues,
  type ForgotPasswordValues,
} from "@/schemas/auth";
import { authRequest } from "@/lib/auth-request";
import { fetchMe } from "../hooks/use-current-user";

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
import { ResetPasswordForm } from "./reset-password-form";
import { ForgotPasswordForm } from "./forgot-password-form";

interface AuthModalProps {
  children: React.ReactElement | React.ReactElement[];
}

export type AuthView =
  | "login"
  | "register"
  | "verify-email"
  | "reset-password"
  | "forgot-password"
  | "forgot-password-sent";

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
  "forgot-password-sent": {
    title: "Kiểm tra email của bạn",
    description:
      "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu.",
  },
  "verify-email": {
    title: "Xác thực email của bạn",
    description:
      "Chúng tôi đã gửi một liên kết xác thực đến email bạn vừa đăng ký.",
  },
  "reset-password": {
    title: "Đặt lại mật khẩu",
    description: "Nhập mật khẩu mới cho tài khoản của bạn",
  },
};

const RESEND_COOLDOWN_SECONDS = 60;
const RESET_TOKEN_QUERY_KEY = "resetToken";

export const AuthModal = ({ children }: AuthModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");

  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [forgotEmail, setForgotEmail] = useState<string | null>(null);
  const [isResendingForgot, setIsResendingForgot] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);

  const [resetToken, setResetToken] = useState<string | null>(null);

  const { title, description } = AUTH_VIEW_CONTENT[view];

  const triggers = Array.isArray(children) ? children : [children];

  const showSocialAndDivider = view === "login" || view === "register";
  const showFooter =
    view === "login" ||
    view === "register" ||
    view === "verify-email" ||
    view === "forgot-password" ||
    view === "forgot-password-sent";
  const showBottomNav =
    view === "login" || view === "register" || view === "forgot-password";

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    if (forgotCooldown <= 0) return;

    const interval = setInterval(() => {
      setForgotCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [forgotCooldown]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get(RESET_TOKEN_QUERY_KEY);

    if (!token) return;

    setResetToken(token);
    setView("reset-password");
    setOpen(true);

    router.replace(window.location.pathname, { scroll: false });
  }, []);

  const handleLogin = async (values: LoginValues) => {
    const result = await authRequest({
      url: "/api/auth/login",
      body: values,
      successMessage: "Đăng nhập thành công.",
      errorMessages: {
        INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng.",
        EMAIL_NOT_VERIFIED: "Vui lòng xác thực email trước khi đăng nhập.",
      },
    });

    if (!result.ok) return;

    await queryClient.invalidateQueries({ queryKey: ["me"] });
    setOpen(false);

    const me = await fetchMe();

    if (me?.role === "ADMIN") {
      router.push("/dashboard");
    } else {
      router.refresh();
    }
  };

  const handleRegister = async (values: RegisterValues) => {
    const result = await authRequest({
      url: "/api/auth/register",
      body: values,
      successMessage: "Đăng ký thành công!",
      errorMessages: {
        EMAIL_ALREADY_IN_USE:
          "Email này đã được đăng ký. Vui lòng chọn email khác.",
      },
    });

    if (result.ok) {
      setRegisteredEmail(values.email);
      setView("verify-email");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    const result = await authRequest({
      url: "/api/auth/forgot-password",
      body: values,
    });

    if (result.ok) {
      setForgotEmail(values.email);
      setView("forgot-password-sent");
      setForgotCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  const handleResetPassword = async (values: ResetPasswordValues) => {
    const result = await authRequest({
      url: "/api/auth/reset-password",
      body: values,
      successMessage: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
      errorMessages: {
        SAME_PASSWORD: "Mật khẩu mới phải khác với mật khẩu hiện tại.",
        RESET_LINK_INVALID:
          "Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.",
        NO_PASSWORD_SET:
          "Tài khoản này đăng nhập bằng Google, vui lòng đăng nhập bằng Google.",
      },
    });

    if (result.ok) {
      setResetToken(null);
      setView("login");
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleResendVerification = async () => {
    if (!registeredEmail || isResending || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const result = await authRequest({
        url: "/api/auth/resend-verification",
        body: { email: registeredEmail },
        successMessage: "Đã gửi lại email xác thực.",
      });

      if (result.ok) {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleResendForgotPassword = async () => {
    if (!forgotEmail || isResendingForgot || forgotCooldown > 0) return;

    setIsResendingForgot(true);
    try {
      const result = await authRequest({
        url: "/api/auth/forgot-password",
        body: { email: forgotEmail },
        successMessage: "Đã gửi lại liên kết đặt lại mật khẩu.",
      });

      if (result.ok) {
        setForgotCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } finally {
      setIsResendingForgot(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setView("login");
          setRegisteredEmail(null);
          setResendCooldown(0);
          setForgotEmail(null);
          setForgotCooldown(0);
          setResetToken(null);
        }
      }}
    >
      {triggers.map((trigger, index) => (
        <DialogTrigger
          key={index}
          render={trigger}
          onClick={() => setOpen(true)}
        />
      ))}

      <DialogContent className="sm:min-w-120 flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showSocialAndDivider && (
          <>
            <Button
              size={"xl"}
              className="gap-2"
              variant={"outline"}
              onClick={handleGoogleLogin}
            >
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
        {view === "reset-password" && resetToken && (
          <ResetPasswordForm
            token={resetToken}
            onSubmit={handleResetPassword}
          />
        )}

        {view === "verify-email" && (
          <div className="flex flex-col items-center gap-5 py-2 text-center">
            <div className="size-14 shrink-0 flex items-center justify-center text-secondary bg-secondary/10 rounded-full">
              <Mail />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">
                Liên kết xác thực đã được gửi đến
              </p>
              {registeredEmail && (
                <p className="text-sm font-medium">{registeredEmail}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Kiểm tra hộp thư (kể cả mục Spam) và nhấn vào liên kết để kích
                hoạt tài khoản.
              </p>
            </div>
          </div>
        )}

        {view === "forgot-password-sent" && (
          <div className="flex flex-col items-center gap-5 py-2 text-center">
            <div className="size-14 shrink-0 flex items-center justify-center text-secondary bg-secondary/10 rounded-full">
              <KeyRound />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">
                Liên kết đặt lại mật khẩu đã được gửi đến
              </p>
              {forgotEmail && (
                <p className="text-sm font-medium">{forgotEmail}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Kiểm tra hộp thư (kể cả mục Spam) và nhấn vào liên kết để đặt
                mật khẩu mới.
              </p>
            </div>
          </div>
        )}

        {showBottomNav && view !== "forgot-password" && (
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
          </div>
        )}

        {showFooter && (
          <DialogFooter>
            {view === "verify-email" && (
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">Chưa nhận được mã?</p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending || resendCooldown > 0}
                    className="hover:text-secondary transition disabled:opacity-50 disabled:hover:text-inherit"
                  >
                    {isResending
                      ? "Đang gửi lại..."
                      : resendCooldown > 0
                        ? `Gửi lại sau ${resendCooldown}s`
                        : "Gửi lại email xác thực"}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">Đã xác thực xong?</p>
                  <button
                    onClick={() => setView("login")}
                    className="hover:text-secondary transition"
                  >
                    Quay lại đăng nhập!
                  </button>
                </div>
              </div>
            )}

            {view === "forgot-password-sent" && (
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">Chưa nhận được mã?</p>
                  <button
                    onClick={handleResendForgotPassword}
                    disabled={isResendingForgot || forgotCooldown > 0}
                    className="hover:text-secondary transition disabled:opacity-50 disabled:hover:text-inherit"
                  >
                    {isResendingForgot
                      ? "Đang gửi lại..."
                      : forgotCooldown > 0
                        ? `Gửi lại sau ${forgotCooldown}s`
                        : "Gửi lại liên kết"}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">Nhớ ra mật khẩu rồi?</p>
                  <button
                    onClick={() => setView("login")}
                    className="hover:text-secondary transition"
                  >
                    Quay lại đăng nhập!
                  </button>
                </div>
              </div>
            )}

            {view === "forgot-password" && (
              <div className="w-full flex items-center justify-center gap-1">
                <p className="text-muted-foreground">Đã nhớ mật khẩu?</p>
                <button
                  onClick={() => setView("login")}
                  className="hover:text-secondary transition"
                >
                  Quay lại đăng nhập!
                </button>
              </div>
            )}

            {(view === "login" || view === "register") && (
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
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
