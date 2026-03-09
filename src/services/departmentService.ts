import apiClient from "@/lib/axios";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ReassignUsersRequest,
} from "@/types/userManagement";

export const departmentService = {
  getDepartments: async (
    params?: Record<string, any>,
  ): Promise<Department[]> => {
    const { data } = await apiClient.get("/api/v1/departments", { params });

    // After the axios interceptor decrypts, `data` is:
    //   { status, message, data: { departments: [...], pagination, stats } }
    // Normalise into a plain Department[].
    let list: Record<string, unknown>[] = [];

    if (Array.isArray(data)) {
      list = data;
    } else {
      const inner = (data as Record<string, unknown>)?.data;
      if (Array.isArray(inner)) {
        list = inner;
      } else {
        const nested = (inner as Record<string, unknown>)?.departments;
        if (Array.isArray(nested)) {
          list = nested;
        } else {
          const topDepts = (data as Record<string, unknown>)?.departments;
          if (Array.isArray(topDepts)) {
            list = topDepts;
          }
        }
      }
    }

    // Map backend fields to frontend Department type
    return list.map((d) => ({
      ...d,
      members: (d.userCount as number) ?? (d.members as number) ?? 0,
      updated: d.updated as string || d.updatedAt as string || "",
    })) as Department[];
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    const { data } = await apiClient.get(`/api/v1/departments/${id}`);
    return data;
  },

  createDepartment: async (
    payload: CreateDepartmentRequest,
  ): Promise<Department> => {
    const { data } = await apiClient.post("/api/v1/departments", payload);
    // The backend may return 2xx with { status: "error", message: "..." }
    const resp = data as Record<string, unknown>;
    if (resp?.status === "error") {
      throw new Error((resp.message as string) || "Failed to create department");
    }
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
    await apiClient.patch(`/api/v1/departments/${id}/approve`, { action: "approve" });
  },

  rejectDepartment: async (id: string, reason?: string): Promise<void> => {
    await apiClient.patch(`/api/v1/departments/${id}/reject`, { action: "reject", reason });
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
