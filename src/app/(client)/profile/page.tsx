"use client";

import { useEffect, useRef, useState } from "react";

import { User, ShieldCheck, Mail, Lock, Camera } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateAvatar } from "@/features/users/hooks/use-update-avatar";
import { useUpdateProfile } from "@/features/users/hooks/use-update-profile";
import { useChangePassword } from "@/features/users/hooks/use-change-password";

type ProfileSection = "info" | "security";

const NAV_ITEMS: {
  key: ProfileSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "info",
    label: "Thông tin cá nhân",
    icon: <User className="size-4" />,
  },
  {
    key: "security",
    label: "Bảo mật",
    icon: <ShieldCheck className="size-4" />,
  },
];

const ProfilePage = () => {
  const [section, setSection] = useState<ProfileSection>("info");

  return (
    <section className="wrapper w-full">
      <PageBreadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Hồ sơ của bạn" }]}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Hồ sơ của bạn</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <aside className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={cn(
                  section === item.key
                    ? "bg-secondary/10 text-secondary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  "flex items-center gap-2 shrink-0 px-3 py-2 rounded-md text-sm transition text-left",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </aside>

          <div className="min-w-0">
            {section === "info" && <ProfileInfoSection />}
            {section === "security" && <ProfileSecuritySection />}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfileInfoSection = () => {
  const [name, setName] = useState("");
  const { data: user, isLoading } = useCurrentUser();

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    updateProfile.mutate({ name: name.trim() });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateAvatar.mutate(file);
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="max-w-lg flex flex-col gap-6">
        <div className="relative size-20 shrink-0">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="absolute -bottom-1 -right-1 size-7 rounded-full" />
        </div>
        <Skeleton className="w-full h-9 rounded-md" />
        <Skeleton className="w-full h-9 rounded-md" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-6">
      <div className="relative size-24 shrink-0">
        <Avatar
          className={cn(
            "size-24 transition-opacity",
            updateAvatar.isPending && "opacity-50",
          )}
        >
          <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
          <AvatarFallback className="bg-secondary/10 text-secondary text-2xl">
            {user?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {updateAvatar.isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
            <Spinner className="size-6 text-secondary" />
          </div>
        )}

        <input
          type="file"
          className="hidden"
          ref={avatarInputRef}
          onChange={handleAvatarChange}
          accept="image/png,image/jpeg,image/webp"
        />

        <Button
          size="icon"
          type="button"
          variant="outline"
          aria-label="Đổi ảnh đại diện"
          disabled={updateAvatar.isPending}
          onClick={() => avatarInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 size-8 rounded-full shadow-sm"
        >
          <Camera className="size-4" />
        </Button>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Họ và tên</FieldLabel>
          <Input
            value={name}
            startIcon={<User />}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            disabled
            type="email"
            startIcon={<Mail />}
            value={user?.email ?? ""}
          />
        </Field>

        <Button
          size="xl"
          type="submit"
          className="w-fit"
          disabled={
            updateProfile.isPending || !name.trim() || name === user?.name
          }
        >
          {updateProfile.isPending && <Spinner className="size-4" />}
          <p>{updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}</p>
        </Button>
      </FieldGroup>
    </form>
  );
};

const ProfileSecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    !changePassword.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Mật khẩu hiện tại</FieldLabel>
          <Input
            type="password"
            startIcon={<Lock />}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Mật khẩu mới</FieldLabel>
          <Input
            type="password"
            startIcon={<Lock />}
            autoComplete="new-password"
            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Field>

        <Button size="xl" type="submit" className="w-fit" disabled={!canSubmit}>
          {changePassword.isPending && <Spinner className="size-4" />}
          <p>
            {changePassword.isPending
              ? "Đang cập nhật..."
              : "Cập nhật mật khẩu"}
          </p>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ProfilePage;
