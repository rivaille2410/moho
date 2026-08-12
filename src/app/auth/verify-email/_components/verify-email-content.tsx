"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CheckCircle2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type VerifyStatus = "verifying" | "success" | "error";

const STATUS_CONTENT: Record<
  VerifyStatus,
  { title: string; description: string }
> = {
  verifying: {
    title: "Đang xác thực email",
    description: "Vui lòng đợi trong giây lát...",
  },
  success: {
    title: "Xác thực thành công!",
    description: "Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng...",
  },
  error: {
    title: "Liên kết không hợp lệ",
    description:
      "Liên kết xác thực này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.",
  },
};

function getVerifyErrorMessage(status: number) {
  if (status === 401) {
    return "Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.";
  }

  return "Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.";
}

export function VerifyEmailContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const hasRun = useRef(false);
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      const message = "Liên kết xác thực không hợp lệ.";
      setStatus("error");
      setErrorDescription(message);
      toast.add({
        type: "error",
        description: message,
        priority: "high",
      });
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const message = getVerifyErrorMessage(res.status);
          setStatus("error");
          setErrorDescription(message);
          toast.add({
            type: "error",
            description: message,
            priority: "high",
          });
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ["me"] });
        setStatus("success");
        toast.add({
          type: "success",
          description: "Xác thực email thành công!",
        });

        setTimeout(() => router.push("/"), 1500);
      } catch {
        const message = "Có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.";
        setStatus("error");
        setErrorDescription(message);
        toast.add({
          type: "error",
          description: message,
          priority: "high",
        });
      }
    };

    verify();
  }, [token, router, queryClient]);

  const { title, description } = STATUS_CONTENT[status];
  const displayDescription =
    status === "error" ? (errorDescription ?? description) : description;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-5 text-center">
        <div
          className={cn(
            status === "verifying"
              ? "text-secondary bg-secondary/10"
              : status === "success"
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-destructive bg-destructive/10",
            "size-16 shrink-0 flex items-center justify-center rounded-full transition-colors duration-300",
          )}
        >
          {status == "verifying" && <Spinner className="size-6" />}
          {status === "success" && (
            <CheckCircle2 className="size-7 animate-in zoom-in duration-300 motion-reduce:animate-none" />
          )}
          {status === "error" && (
            <XCircle className="size-7 animate-in zoom-in duration-300 motion-reduce:animate-none" />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{displayDescription}</p>
        </div>

        {status === "error" && (
          <div className="w-full flex flex-col gap-2 pt-1">
            <Button size="xl" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
