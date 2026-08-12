"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User, Mail, Lock } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useCreateUser } from "@/features/users/hooks/use-create-user";
import { CreateUserFormValues, createUserSchema } from "@/schemas/user";

const roleItems = [
  { label: "Người dùng", value: "CUSTOMER" },
  { label: "Quản trị viên", value: "ADMIN" },
];

const defaultValues: CreateUserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "CUSTOMER",
};

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);

  const createUser = useCreateUser();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset(defaultValues);
      createUser.reset();
    }
  };

  const onSubmit = (values: CreateUserFormValues) => {
    createUser.mutate(values, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            Thêm người dùng
          </Button>
        }
      />

      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Tài khoản sẽ được tạo và xác thực email ngay, người dùng có thể đăng
            nhập bằng mật khẩu này ngay lập tức.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Họ và tên</FieldLabel>
              <Input
                startIcon={<User />}
                placeholder="Nhập họ và tên"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                startIcon={<Mail />}
                placeholder="Nhập địa chỉ email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Mật khẩu</FieldLabel>
              <Input
                type="password"
                startIcon={<Lock />}
                placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <FieldError>
                  {form.formState.errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Vai trò</FieldLabel>
              <Select
                items={roleItems}
                value={form.watch("role")}
                onValueChange={(value: string | null) =>
                  form.setValue(
                    "role",
                    (value ?? "CUSTOMER") as "CUSTOMER" | "ADMIN",
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button size={"lg"} type="submit" disabled={createUser.isPending}>
              {createUser.isPending && <Spinner className="size-4" />}
              {createUser.isPending ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
