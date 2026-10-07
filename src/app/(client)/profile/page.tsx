"use client";

import { useEffect, useRef, useState } from "react";

import { User, ShieldCheck, Mail, Lock, Camera, MapPin } from "lucide-react";

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
import { AddressBookSection } from "@/features/addresses/components/address-book-section";

type ProfileSection = "info" | "addresses" | "security";

const NAV_ITEMS: {
  key: ProfileSection;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "info",
    label: "Thông tin cá nhân",
    shortLabel: "Cá nhân",
    icon: <User className="size-5 md:size-4" />,
  },
  {
    key: "addresses",
    label: "Sổ địa chỉ",
    shortLabel: "Địa chỉ",
    icon: <MapPin className="size-5 md:size-4" />,
  },
  {
    key: "security",
    label: "Bảo mật",
    shortLabel: "Bảo mật",
    icon: <ShieldCheck className="size-5 md:size-4" />,
  },
];

const ProfilePage = () => {
  const [section, setSection] = useState<ProfileSection>("info");

  const { data: user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const navItems = isAdmin
    ? NAV_ITEMS.filter((item) => item.key !== "addresses")
    : NAV_ITEMS;

  useEffect(() => {
    if (isAdmin && section === "addresses") setSection("info");
  }, [isAdmin, section]);

  return (
    <section className="w-full space-y-3 pb-12">
      <PageBreadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Hồ sơ của bạn" }]}
      />

      <div className="wrapper space-y-5">
        <div className="hidden flex-col gap-1 md:flex">
          <h1 className="text-2xl font-semibold">Hồ sơ của bạn</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản
          </p>
        </div>

        <ProfileHero />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[240px_1fr] md:gap-8">
          <nav
            aria-label="Mục hồ sơ"
            style={{ gridTemplateColumns: `repeat(${navItems.length}, 1fr)` }}
            className="grid gap-1 rounded-2xl bg-muted p-1 md:flex md:flex-col md:self-start md:bg-transparent md:p-0"
          >
            {navItems.map((item) => {
              const isActive = section === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setSection(item.key)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs md:flex-row md:justify-start md:gap-2 md:rounded-md md:px-3 md:py-2 md:text-sm md:text-left",
                    isActive
                      ? "bg-background font-semibold text-secondary shadow-xs md:bg-secondary/10 md:font-medium md:shadow-none"
                      : "text-muted-foreground hover:text-foreground md:hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="min-w-0">
            {section === "info" && <ProfileInfoSection />}
            {section === "addresses" && <AddressBookSection />}
            {section === "security" && <ProfileSecuritySection />}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfileHero = () => {
  const { data: user, isLoading } = useCurrentUser();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const updateAvatar = useUpdateAvatar();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateAvatar.mutate(file);
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Skeleton className="h-20 w-full rounded-none sm:h-28" />
        <div className="flex items-end gap-4 px-5 pb-5">
          <Skeleton className="-mt-12 size-24 shrink-0 rounded-full ring-4 ring-background sm:-mt-14 sm:size-28" />
          <div className="flex-1 space-y-2 pb-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="h-20 bg-linear-to-br from-secondary via-secondary/80 to-secondary/40 sm:h-28" />

      <div className="flex items-end gap-4 px-5 pb-5">
        <div className="relative -mt-12 shrink-0 sm:-mt-14">
          <Avatar
            className={cn(
              "size-24 ring-4 ring-background transition-opacity sm:size-28",
              updateAvatar.isPending && "opacity-50",
            )}
          >
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
            <AvatarFallback className="text-3xl">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {updateAvatar.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
              <Spinner className="size-6 text-white" />
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
            className="absolute -bottom-1 -right-1 size-9 rounded-full shadow-xs"
          >
            <Camera className="size-4" />
          </Button>
        </div>

        <div className="min-w-0 flex-1 space-y-1 pt-3 pb-1">
          <p className="truncate text-lg font-semibold sm:text-xl">
            {user?.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {user?.email}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
            <ShieldCheck className="size-3" />
            {isAdmin ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>
      </div>
    </div>
  );
};

const FormCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="max-w-xl rounded-2xl border bg-card p-5 sm:p-6">
    <div className="mb-5 space-y-1">
      <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const ProfileInfoSection = () => {
  const [name, setName] = useState("");
  const { data: user, isLoading } = useCurrentUser();

  const updateProfile = useUpdateProfile();

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

  if (isLoading) {
    return (
      <div className="flex max-w-xl flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  return (
    <FormCard
      title="Thông tin cá nhân"
      description="Cập nhật tên hiển thị của bạn trên MOHO"
    >
      <form onSubmit={handleSubmit}>
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
            className="w-full sm:w-fit"
            disabled={
              updateProfile.isPending || !name.trim() || name === user?.name
            }
          >
            {updateProfile.isPending && <Spinner className="size-4" />}
            <p>{updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}</p>
          </Button>
        </FieldGroup>
      </form>
    </FormCard>
  );
};

const STRENGTH_LEVELS = [
  { label: "Yếu", bar: "bg-destructive", text: "text-destructive" },
  { label: "Khá", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Mạnh", bar: "bg-emerald-500", text: "text-emerald-600" },
];

const getPasswordStrength = (password: string) =>
  [password.length >= 8, /\d/.test(password), /[A-Z]/.test(password)].filter(
    Boolean,
  ).length;

const ProfileSecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = useChangePassword();

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    !changePassword.isPending;

  const strength = getPasswordStrength(newPassword);
  const level = strength > 0 ? STRENGTH_LEVELS[strength - 1] : null;

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
    <FormCard
      title="Đổi mật khẩu"
      description="Dùng mật khẩu dài, khó đoán để bảo vệ tài khoản của bạn"
    >
      <form onSubmit={handleSubmit}>
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

            {newPassword.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1.5">
                  {STRENGTH_LEVELS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full",
                        i < strength && level ? level.bar : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Độ mạnh:{" "}
                  <span className={cn("font-medium", level?.text)}>
                    {level?.label ?? "Quá ngắn"}
                  </span>
                  {strength < 3 && " · Thêm chữ số và chữ in hoa để mạnh hơn"}
                </p>
              </div>
            )}
          </Field>

          <Button
            size="xl"
            type="submit"
            disabled={!canSubmit}
            className="w-full sm:w-fit"
          >
            {changePassword.isPending && <Spinner className="size-4" />}
            <p>
              {changePassword.isPending
                ? "Đang cập nhật..."
                : "Cập nhật mật khẩu"}
            </p>
          </Button>
        </FieldGroup>
      </form>
    </FormCard>
  );
};

export default ProfilePage;
