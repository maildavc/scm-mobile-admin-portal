import apiClient from "@/lib/axios";
import type {
  User,
  CreateUserRequest,
  UpdateProfileRequest,
  PaginatedResponse,
} from "@/types/userManagement";
import type { ChangePasswordRequest } from "@/types/auth"; // Reusing from auth if it fits, or we can use any

// Backend wraps responses: { isSuccess, isFailure, value: <actual payload>, error, errors }
type BackendEnvelope<T> = {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: unknown;
  errors: unknown;
};

export const userService = {
  getUsers: async (
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<User> | User[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<PaginatedResponse<User> | User[]>
    >("/api/v1/users", { params });
    return data.value ?? (data as unknown as PaginatedResponse<User> | User[]);
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/api/v1/users/${id}`);
    return data;
  },

  createUser: async (payload: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post("/api/v1/users", payload);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${id}`);
  },

  approveUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/users/${id}/approve`);
  },

  updateProfile: async (payload: UpdateProfileRequest): Promise<User> => {
    const { data } = await apiClient.put("/api/v1/users/profile", payload);
    return data;
  },

  updateProfileImage: async (payload: { imageUrl: string }): Promise<void> => {
    await apiClient.put("/api/v1/users/profile/image", payload);
  },

  uploadProfileImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post(
      "/api/v1/users/profile/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },

  updatePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await apiClient.put("/api/v1/users/password", payload);
  },

  updateUserRole: async (
    id: string,
    payload: { roleId: string },
  ): Promise<void> => {
    await apiClient.put(`/api/v1/users/${id}/role`, payload);
  },

  updateUserStatus: async (
    id: string,
    payload: { status: string },
  ): Promise<void> => {
    await apiClient.put(`/api/v1/users/${id}/status`, payload);
  },
};
