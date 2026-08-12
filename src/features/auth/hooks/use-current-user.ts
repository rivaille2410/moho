import { useQuery } from "@tanstack/react-query";

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string | null;
}

export async function fetchMe(): Promise<CurrentUser | null> {
  const res = await fetch("/api/auth/me", { method: "POST" });
  if (!res.ok) return null;
  return res.json();
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
