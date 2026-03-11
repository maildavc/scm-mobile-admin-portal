import apiClient from "@/lib/axios";
export interface BackendEnvelope<T> {
  isSuccess?: boolean;
  value?: T;
  error?: string;
  status?: "success" | "error";
  message?: string;
  data?: T;
}
import {
  IntegrationDto,
  CreateIntegrationRequestDto,
  UpdateIntegrationRequestDto,
  IntegrationDetailsDto,
  IntegrationsPagedResponse,
  IntegrationLogsPagedResponse
} from "@/types/integration";

export interface GetIntegrationsParams {
  Page: number;
  PageSize: number;
  SearchTerm?: string;
  Statuses?: number[];
  Types?: number[];
  IsEnabled?: boolean;
  HasErrors?: boolean;
}

export const integrationService = {
  getIntegrations: async (
    params?: Record<string, any>,
  ): Promise<IntegrationsPagedResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<IntegrationsPagedResponse>>(
      "/api/v1/integrations",
      { params }
    );
    return (data.value !== undefined ? data.value : data.data) as IntegrationsPagedResponse;
  },

  getIntegrationDetails: async (
    id: string
  ): Promise<IntegrationDetailsDto> => {
    const { data } = await apiClient.get<BackendEnvelope<IntegrationDetailsDto>>(
      `/api/v1/integrations/${id}`
    );
    return (data.value !== undefined ? data.value : data.data) as IntegrationDetailsDto;
  },

  createIntegration: async (
    payload: CreateIntegrationRequestDto,
  ): Promise<IntegrationDto> => {
    const { data } = await apiClient.post<Record<string, any>>(
      "/api/v1/integrations",
      payload,
    );
    if (!data) return {} as IntegrationDto;
    if (data.isSuccess === false || data.status === "error") {
      throw new Error(data.error || data.message || "Failed to create integration");
    }
    if (data.value !== undefined) return data.value;
    if (data.data !== undefined) return data.data;
    return data as IntegrationDto;
  },

  updateIntegration: async (
    id: string,
    payload: UpdateIntegrationRequestDto,
  ): Promise<IntegrationDto> => {
    const { data } = await apiClient.put<Record<string, any>>(
      `/api/v1/integrations/${id}`,
      payload,
    );
    if (!data) return {} as IntegrationDto;
    if (data.isSuccess === false || data.status === "error") {
      throw new Error(data.error || data.message || "Failed to update integration");
    }
    if (data.value !== undefined) return data.value;
    if (data.data !== undefined) return data.data;
    return data as IntegrationDto;
  },

  deleteIntegration: async (id: string): Promise<void> => {
    const { data } = await apiClient.delete<Record<string, any>>(
      `/api/v1/integrations/${id}`,
    );
    if (data && (data.isSuccess === false || data.status === "error")) {
      throw new Error(data.error || data.message || "Failed to delete integration");
    }
  },

  connectIntegration: async (id: string): Promise<void> => {
    const { data } = await apiClient.post<Record<string, any>>(
      `/api/v1/integrations/${id}/connect`,
    );
    if (data && (data.isSuccess === false || data.status === "error")) {
      throw new Error(data.error || data.message || "Failed to connect integration");
    }
  },

  disconnectIntegration: async (id: string): Promise<void> => {
    const { data } = await apiClient.post<Record<string, any>>(
      `/api/v1/integrations/${id}/disconnect`,
    );
    if (data && (data.isSuccess === false || data.status === "error")) {
      throw new Error(data.error || data.message || "Failed to disconnect integration");
    }
  },

  testIntegration: async (id: string): Promise<void> => {
    const { data } = await apiClient.post<Record<string, any>>(
      `/api/v1/integrations/${id}/test`,
    );
    if (data && (data.isSuccess === false || data.status === "error")) {
      throw new Error(data.error || data.message || "Connection test failed");
    }
  },

  getIntegrationLogs: async (
    id: string,
    params: { Page: number; PageSize: number; IntegrationId: string }
  ): Promise<IntegrationLogsPagedResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<IntegrationLogsPagedResponse>>(
      `/api/v1/integrations/${id}/logs`,
      { params }
    );
    return (data.value !== undefined ? data.value : data.data) as IntegrationLogsPagedResponse;
  },
};
