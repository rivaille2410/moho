import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { queryKeys } from "@/lib/query-keys";

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string | null;
}

export async function fetchMe(): Promise<CurrentUser | null> {
  return authApi.getMe();
}

export const useCurrentUser = () => {
  return useQuery<CurrentUser | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
