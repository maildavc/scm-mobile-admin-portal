import apiClient from "@/lib/axios";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ReassignUsersRequest,
} from "@/types/userManagement";

export const roleService = {
  getRoles: async (
    params?: Record<string, any>,
  ): Promise<Role[]> => {
    const { data } = await apiClient.get("/api/v1/roles", { params });

    // After the axios interceptor decrypts, `data` is:
    //   { status: "success", message: "...", data: [ ...roles ] }
    // Extract the inner array.
    if (Array.isArray(data)) return data as Role[];

    const inner = (data as Record<string, unknown>)?.data;
    if (Array.isArray(inner)) return inner as Role[];

    return [];
  },

  getRoleById: async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/api/v1/roles/${id}`);
    return data;
  },

  createRole: async (payload: CreateRoleRequest): Promise<Role> => {
    const { data } = await apiClient.post("/api/v1/roles", payload);
    const resp = data as Record<string, unknown>;
    if (resp?.status === "error") {
      throw new Error((resp.message as string) || "Failed to create role");
    }
    return data;
  },

  updateRole: async (id: string, payload: UpdateRoleRequest): Promise<Role> => {
    const { data } = await apiClient.patch(`/api/v1/roles/${id}`, payload);
    return data;
  },

  approveRole: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/roles/${id}/approve`, { action: "approve" });
  },

  rejectRole: async (id: string, reason?: string): Promise<void> => {
    await apiClient.patch(`/api/v1/roles/${id}/reject`, { action: "reject", reason });
  },

  deactivateRole: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/roles/${id}/deactivate`);
  },

  reassignUsers: async (
    id: string,
    payload: ReassignUsersRequest,
  ): Promise<void> => {
    await apiClient.post(`/api/v1/roles/${id}/reassign-users`, payload);
  },
};
