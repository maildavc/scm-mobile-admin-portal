import apiClient from "@/lib/axios";
import type {
  User,
  CreateUserRequest,
  UpdateProfileRequest,
} from "@/types/userManagement";
import type { ChangePasswordRequest } from "@/types/auth";

function formatDate(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const userService = {
  getUsers: async (
    params?: Record<string, any>,
  ): Promise<User[]> => {
    const { data } = await apiClient.get("/api/v1/users", { params });

    // After the axios interceptor decrypts, `data` is:
    //   { status: "success", data: [ ...users ] }
    // Extract the inner array.
    let users: User[];
    if (Array.isArray(data)) {
      users = data as User[];
    } else {
      const inner = (data as Record<string, unknown>)?.data;
      users = Array.isArray(inner) ? (inner as User[]) : [];
    }

    // Map list fields to the shape the UI expects
    return users.map((u) => ({
      ...u,
      roleName: u.roleName || u.role || "Unassigned",
      roleType: u.expiryStatus || u.roleType || "Permanent",
      roleExpiry: u.expires || u.roleExpiry,
      updated: formatDate(u.dateModified) || u.updated || "N/A",
    }));
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/api/v1/users/${id}`);
    return data;
  },

  createUser: async (payload: CreateUserRequest): Promise<User> => {
    const { data } = await apiClient.post("/api/v1/users", payload);
    const resp = data as Record<string, unknown>;
    if (resp?.status === "error") {
      throw new Error((resp.message as string) || "Failed to create user");
    }
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${id}`);
  },

  approveUser: async (
    id: string,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<void> => {
    await apiClient.patch(`/api/v1/users/${id}/approve`, {
      userId: id,
      action,
      ...(reason ? { reason } : {}),
    });
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

  deactivateUser: async (id: string, reason?: string): Promise<void> => {
    await apiClient.put(`/api/v1/users/${id}/status`, {
      userId: id,
      status: 0,
      reason: reason || "User deactivated by admin",
    });
  },
};
