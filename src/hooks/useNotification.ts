import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, GetNotificationsParams } from "@/services/notificationService";
import {
  CreateNotificationRequestDto,
  UpdateNotificationRequestDto,
  UpdateNotificationSettingsRequest,
} from "@/types/notification";
import { useToastStore } from "@/stores/toastStore";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: GetNotificationsParams) => [...notificationKeys.lists(), params] as const,
  details: () => [...notificationKeys.all, "detail"] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  stats: () => [...notificationKeys.all, "stats"] as const,
  settings: () => [...notificationKeys.all, "settings"] as const,
};

// --- Queries ---
export const useNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useNotificationDetails = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationService.getNotificationDetails(id),
    enabled: !!id,
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: () => notificationService.getDashboardStats(),
  });
};

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: () => notificationService.getSettings(),
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: UpdateNotificationSettingsRequest) =>
      notificationService.updateSettings(payload),
    onSuccess: (result) => {
      addToast(result?.message || "Notification settings updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
    onError: (error: { message?: string; response?: { data?: { message?: string } } }) => {
      addToast(
        error?.response?.data?.message || error?.message || "Failed to update notification settings",
        "error",
      );
    },
  });
};

// --- Mutations ---
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: CreateNotificationRequestDto) =>
      notificationService.createNotification(payload),
    onSuccess: () => {
      addToast("Notification created successfully", "success");
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      addToast(error?.response?.data?.message || "Failed to create notification", "error");
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotificationRequestDto }) =>
      notificationService.updateNotification(id, payload),
    onSuccess: (_, variables) => {
      addToast("Notification updated successfully", "success");
      queryClient.invalidateQueries({
        queryKey: notificationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      addToast(error?.response?.data?.message || "Failed to update notification", "error");
    },
  });
};

export const useNotificationAction = (actionName: string) => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({
      id,
      action,
      reason,
      notes,
    }: {
      id: string;
      action: "submit" | "approve" | "reject" | "send" | "cancel";
      reason?: string;
      notes?: string;
    }) => {
      switch (action) {
        case "submit":
          return notificationService.submitNotification(id);
        case "approve":
          return notificationService.approveNotification({
            id,
            notes,
            sendImmediately: true,
          });
        case "reject":
          return notificationService.rejectNotification({
            id,
            reason: reason || "Rejected",
            notes,
          });
        case "send":
          return notificationService.sendNotification(id);
        case "cancel":
          return notificationService.cancelNotification(id);
        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: (_, variables) => {
      addToast(`Notification ${actionName} successfully`, "success");
      queryClient.invalidateQueries({
        queryKey: notificationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      addToast(error?.response?.data?.message || `Failed to ${actionName} notification`, "error");
    },
  });
};
