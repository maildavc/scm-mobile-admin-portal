import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  integrationService,
  GetIntegrationsParams,
} from "@/services/integrationService";
import {
  CreateIntegrationRequestDto,
  UpdateIntegrationRequestDto,
} from "@/types/integration";
import { useToastStore } from "@/stores/toastStore";

// Keys for React Query cache
export const integrationKeys = {
  all: ["integrations"] as const,
  lists: () => [...integrationKeys.all, "list"] as const,
  list: (params: GetIntegrationsParams) =>
    [...integrationKeys.lists(), params] as const,
  details: () => [...integrationKeys.all, "detail"] as const,
  detail: (id: string) => [...integrationKeys.details(), id] as const,
  logs: (id: string) => [...integrationKeys.all, "logs", id] as const,
};

// --- Queries ---

export const useIntegrations = (params: GetIntegrationsParams) => {
  return useQuery({
    queryKey: integrationKeys.list(params),
    queryFn: () => integrationService.getIntegrations(params),
  });
};

export const useIntegrationDetails = (id: string) => {
  return useQuery({
    queryKey: integrationKeys.detail(id),
    queryFn: () => integrationService.getIntegrationDetails(id),
    enabled: !!id,
  });
};

export const useIntegrationLogs = (id: string, params: { Page: number; PageSize: number }) => {
  return useQuery({
    queryKey: [...integrationKeys.logs(id), params],
    queryFn: () => integrationService.getIntegrationLogs(id, { ...params, IntegrationId: id }),
    enabled: !!id,
  });
};

// --- Mutations ---

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: CreateIntegrationRequestDto) =>
      integrationService.createIntegration(payload),
    onSuccess: () => {
      addToast("Integration connected successfully", "success");
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Failed to create integration", "error"
      );
    },
  });
};

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateIntegrationRequestDto;
    }) => integrationService.updateIntegration(id, payload),
    onSuccess: (_, variables) => {
      addToast("Integration updated successfully", "success");
      queryClient.invalidateQueries({
        queryKey: integrationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Failed to update integration", "error"
      );
    },
  });
};

export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => integrationService.deleteIntegration(id),
    onSuccess: () => {
      addToast("Integration removed successfully", "success");
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Failed to remove integration", "error"
      );
    },
  });
};

export const useConnectIntegration = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => integrationService.connectIntegration(id),
    onSuccess: (_, id) => {
      addToast("Integration connection initiated", "success");
      queryClient.invalidateQueries({ queryKey: integrationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Failed to connect integration", "error"
      );
    },
  });
};

export const useDisconnectIntegration = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => integrationService.disconnectIntegration(id),
    onSuccess: (_, id) => {
      addToast("Integration disconnected successfully", "success");
      queryClient.invalidateQueries({ queryKey: integrationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Failed to disconnect integration", "error"
      );
    },
  });
};

export const useTestIntegration = () => {
  const addToast = useToastStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => integrationService.testIntegration(id),
    onSuccess: () => {
      addToast("Connection test successful", "success");
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message || "Connection test failed", "error"
      );
    },
  });
};
