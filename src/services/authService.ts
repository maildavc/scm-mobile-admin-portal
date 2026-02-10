import apiClient from "@/lib/axios";
import type { LoginRequest, LoginResponse, ChangePasswordRequest } from "@/types/auth";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>("/api/v1/auth/login", payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.put<{ message: string }>("/api/users/password", payload);
    return data;
  },
};
