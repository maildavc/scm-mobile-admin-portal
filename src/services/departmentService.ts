import apiClient from "@/lib/axios";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
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

export const departmentService = {
  getDepartments: async (
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<Department> | Department[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<PaginatedResponse<Department> | Department[]>
    >("/api/v1/departments", { params });
    return (
      data.value ??
      (data as unknown as PaginatedResponse<Department> | Department[])
    );
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    const { data } = await apiClient.get(`/api/v1/departments/${id}`);
    return data;
  },

  createDepartment: async (
    payload: CreateDepartmentRequest,
  ): Promise<Department> => {
    const { data } = await apiClient.post("/api/v1/departments", payload);
    return data;
  },

  updateDepartment: async (
    id: string,
    payload: UpdateDepartmentRequest,
  ): Promise<Department> => {
    const { data } = await apiClient.patch(
      `/api/v1/departments/${id}`,
      payload,
    );
    return data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/departments/${id}`);
  },

  approveDepartment: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/departments/${id}/approve`);
  },

  rejectDepartment: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/departments/${id}/reject`);
  },

  deactivateDepartment: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/v1/departments/${id}/deactivate`);
  },

  reassignUsers: async (
    id: string,
    payload: ReassignUsersRequest,
  ): Promise<void> => {
    await apiClient.post(`/api/v1/departments/${id}/reassign-users`, payload);
  },
};
