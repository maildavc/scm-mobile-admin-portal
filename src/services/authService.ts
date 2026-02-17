import apiClient from "@/lib/axios";
import { encryptAES } from "@/lib/encryption";
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
} from "@/types/auth";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const encryptedPayload = {
      ...payload,
      password: encryptAES(payload.password),
    };
    const { data } = await apiClient.post<LoginResponse>(
      "/api/v1/auth/login",
      encryptedPayload,
    );
    return data;
  },

  changePassword: async (
    payload: ChangePasswordRequest,
  ): Promise<{ message: string }> => {
    const encryptedPayload = {
      ...payload,
      currentPassword: encryptAES(payload.currentPassword),
      newPassword: encryptAES(payload.newPassword),
    };
    const { data } = await apiClient.put<{ message: string }>(
      "/api/users/password",
      encryptedPayload,
    );
    return data;
  },
};
