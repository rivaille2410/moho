import { apiClient } from "@/lib/api-client";
import {
  QueryUsersParams,
  UsersResponse,
  UserListItem,
} from "../hooks/use-users";

export const usersApi = {
  list(params: QueryUsersParams = {}) {
    return apiClient.get<UsersResponse>("/api/users", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        role: params.role,
        emailVerified: params.emailVerified,
        banned: params.banned,
      },
    });
  },

  get(id: string) {
    return apiClient.get<UserListItem>(`/api/users/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<UserListItem>("/api/users", input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/users/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<void>("/api/users/bulk", { ids });
  },

  ban(id: string, reason?: string) {
    return apiClient.patch<void>(`/api/users/${id}/ban`, { reason });
  },

  unban(id: string) {
    return apiClient.patch<void>(`/api/users/${id}/unban`);
  },

  changeRole(id: string, role: string) {
    return apiClient.patch<void>(`/api/users/${id}/role`, { role });
  },

  updateProfile(data: { name: string }) {
    return apiClient.patch<void>("/api/users/me", data);
  },

  changePassword(data: unknown) {
    return apiClient.patch<void>("/api/users/me/password", data);
  },

  updateAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.post<{ avatarUrl: string }>("/api/users/me/avatar", formData);
  },
};
