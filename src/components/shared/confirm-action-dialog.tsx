"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  isPending?: boolean;
  confirmLabel: string;
  pendingLabel: string;
  icon: React.ReactNode;
  onConfirm: () => void;
  description: React.ReactNode;
  variant?: "destructive" | "default";
  onOpenChange: (open: boolean) => void;
}

export function ConfirmActionDialog({
  open,
  icon,
  title,
  onConfirm,
  isPending,
  description,
  onOpenChange,
  confirmLabel,
  pendingLabel,
  variant = "destructive",
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="md">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              variant === "destructive"
                ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
                : "bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary"
            }
          >
            {icon}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Huỷ
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isPending && <Spinner />}
            {isPending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
