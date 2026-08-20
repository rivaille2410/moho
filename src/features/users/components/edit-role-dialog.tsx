"use client";

import * as React from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { type UserListItem } from "@/features/users/hooks/use-users";

const roleItems = [
  { label: "Quản trị viên", value: "ADMIN" },
  { label: "Người dùng", value: "CUSTOMER" },
];

interface EditRoleDialogProps {
  user: UserListItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: string) => void;
  isPending?: boolean;
}

export function EditRoleDialog({
  user,
  onOpenChange,
  onConfirm,
  isPending,
}: EditRoleDialogProps) {
  const [role, setRole] = React.useState<string>(user?.role ?? "CUSTOMER");

  React.useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-120">
        <DialogHeader>
          <DialogTitle>Đổi vai trò</DialogTitle>
          <DialogDescription>
            Cập nhật vai trò cho{" "}
            <span className="font-medium text-foreground">{user?.name}</span> (
            {user?.email}).
          </DialogDescription>
        </DialogHeader>

        <Select
          items={roleItems}
          value={role}
          onValueChange={(v) => v && setRole(v)}
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

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            disabled={isPending || role === user?.role}
            onClick={() => onConfirm(role)}
          >
            {isPending && <Spinner />}
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
