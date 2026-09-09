import { useQuery } from "@tanstack/react-query";

import { UnreadCountResponse } from "@/types/notification";

async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  const res = await fetch("/api/notifications/unread-count", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return res.json();
}

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};
