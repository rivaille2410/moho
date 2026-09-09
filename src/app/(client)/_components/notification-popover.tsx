"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { vi } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, CheckCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useMarkAsRead } from "@/features/notifications/hooks/use-mark-as-read";
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMarkAllAsRead } from "@/features/notifications/hooks/use-mark-all-as-read";

export const NotificationPopover = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { data: notificationsData, isLoading } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const unreadCount = unreadData?.count ?? 0;
  const notifications: Notification[] = notificationsData ?? [];

  const handleNotificationClick = (n: Notification) => {
    if (!n.isRead) markAsRead(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            size={"icon-xl"}
            variant={"ghost"}
            className="md:w-auto md:px-3 md:gap-1 md:justify-start"
          >
            <span className="relative inline-flex">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] font-medium text-white ring-2 ring-background">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <span className="hidden md:inline text-sm font-medium">
              Thông báo
            </span>
          </Button>
        }
      />

      <PopoverContent align="end" className="md:min-w-sm p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-medium text-sm">Thông báo</p>
          {unreadCount > 0 && (
            <Button
              size={"sm"}
              variant={"ghost"}
              disabled={isMarkingAll}
              onClick={() => markAllAsRead()}
              className="h-fit p-0 text-xs text-muted-foreground hover:text-secondary"
            >
              <CheckCheck className="size-3.5" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-5 text-secondary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <BellOff className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Không có thông báo nào.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors",
                  !n.isRead && "bg-muted/30",
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="size-2 mt-1 rounded-full bg-primary shrink-0" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
