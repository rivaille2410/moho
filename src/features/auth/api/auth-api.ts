import { apiClient } from "@/lib/api-client";
import {
  type LoginValues,
  type RegisterValues,
  type ResetPasswordValues,
  type ForgotPasswordValues,
} from "@/schemas/auth";
import { CurrentUser } from "../hooks/use-current-user";

export const authApi = {
  getMe() {
    return apiClient.post<CurrentUser | null>("/api/auth/me").catch(() => null);
  },

  login(values: LoginValues) {
    return apiClient.post<{ user: CurrentUser }>("/api/auth/login", values);
  },

  register(values: RegisterValues) {
    return apiClient.post<{ message: string }>("/api/auth/register", values);
  },

  forgotPassword(values: ForgotPasswordValues) {
    return apiClient.post<{ message: string }>("/api/auth/forgot-password", values);
  },

  resetPassword(values: ResetPasswordValues) {
    return apiClient.post<{ message: string }>("/api/auth/reset-password", values);
  },

  resendVerification(email: string) {
    return apiClient.post<{ message: string }>("/api/auth/resend-verification", { email });
  },

  logout() {
    return apiClient.post<void>("/api/auth/logout");
  },
};
