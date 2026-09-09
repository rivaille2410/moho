import { useMutation, useQueryClient } from "@tanstack/react-query";

async function markAllAsRead(): Promise<{ count: number }> {
  const res = await fetch("/api/notifications/read-all", {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return res.json();
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
