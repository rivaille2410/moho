"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  Notification,
  UnreadCountResponse,
  NotificationsResponse,
} from "@/types/notification";
import { getNotificationSocket } from "@/lib/socket";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    const socket = getNotificationSocket();
    socket.connect();

    const handleNewNotification = (notification: Notification) => {
      queryClient.setQueryData<NotificationsResponse>(
        ["notifications"],
        (old) => (old ? [notification, ...old] : [notification]),
      );
    };

    const handleUnreadCount = (data: UnreadCountResponse) => {
      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        data,
      );
    };

    const handleAuthError = () => {
      socket.disconnect();
    };

    const handleConnectError = (err: Error) => {
      console.error("Notification socket connect error:", err.message);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);
    socket.on("auth_error", handleAuthError);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
      socket.off("auth_error", handleAuthError);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [user, queryClient]);
};
