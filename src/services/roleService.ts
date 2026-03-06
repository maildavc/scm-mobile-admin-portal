import apiClient from "@/lib/axios";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ReassignUsersRequest,
  PaginatedResponse,
} from "@/types/userManagement";

// Backend wraps responses: { isSuccess, isFailure, value: <actual payload>, error, errors }
type BackendEnvelope<T> = {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: unknown;
  errors: unknown;
};

export const roleService = {
  getRoles: async (
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<Role> | Role[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<PaginatedResponse<Role> | Role[]>
    >("/api/v1/roles", { params });
    return data.value ?? (data as unknown as PaginatedResponse<Role> | Role[]);
  },

  getRoleById: async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/api/v1/roles/${id}`);
    return data;
  },

  createRole: async (payload: CreateRoleRequest): Promise<Role> => {
    const { data } = await apiClient.post("/api/v1/roles", payload);
    return data;
  },

  updateRole: async (id: string, payload: UpdateRoleRequest): Promise<Role> => {
    const { data } = await apiClient.patch(`/api/v1/roles/${id}`, payload);
    return data;
  },

  approveRole: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/roles/${id}/approve`);
  },

  rejectRole: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/roles/${id}/reject`);
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
