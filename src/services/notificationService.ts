import apiClient from "@/lib/axios";
import {
  NotificationListResponse,
  NotificationDto,
  CreateNotificationRequestDto,
  UpdateNotificationRequestDto,
  ApproveNotificationDto,
  RejectNotificationDto,
  NotificationDashboardStatsDto,
} from "@/types/notification";

export interface GetNotificationsParams {
  Page: number;
  PageSize: number;
  [key: string]: string | number | boolean | undefined;
}

export const notificationService = {
  getNotifications: async (
    params: GetNotificationsParams
  ): Promise<NotificationListResponse> => {
    const { data } = await apiClient.get<unknown>(
      "/api/v1/notifications",
      { params }
    );
    const d = data as Record<string, unknown>;
    // Backend returns items[] + stats embedded at root level
    return {
      data: (d.items as NotificationDto[]) || [],
      totalCount: (d.totalCount as number) || 0,
      page: (d.page as number) || 1,
      limit: (d.pageSize as number) || params.PageSize,
      totalPages: (d.totalPages as number) || 1,
      stats: d.stats as NotificationDashboardStatsDto,
    } as NotificationListResponse;
  },

  getNotificationDetails: async (id: string): Promise<NotificationDto> => {
    const { data } = await apiClient.get<unknown>(`/api/v1/notifications/${id}`);
    const d = data as Record<string, unknown>;
    if (d.isSuccess !== undefined) {
      return (d.value || d.data) as NotificationDto;
    }
    return (d.data || d) as NotificationDto;
  },

  createNotification: async (
    payload: CreateNotificationRequestDto
  ): Promise<unknown> => {
    const { data } = await apiClient.post("/api/v1/notifications", payload);
    return data;
  },

  updateNotification: async (
    id: string,
    payload: UpdateNotificationRequestDto
  ): Promise<unknown> => {
    const { data } = await apiClient.put(
      `/api/v1/notifications/${id}`,
      payload
    );
    return data;
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/notifications/${id}`);
  },

  submitNotification: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/notifications/${id}/submit`);
  },

  approveNotification: async (payload: ApproveNotificationDto): Promise<void> => {
    await apiClient.put(`/api/v1/notifications/${payload.id}/approve`, payload);
  },

  rejectNotification: async (payload: RejectNotificationDto): Promise<void> => {
    await apiClient.put(`/api/v1/notifications/${payload.id}/reject`, payload);
  },

  sendNotification: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/notifications/${id}/send`);
  },

  cancelNotification: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/notifications/${id}/cancel`);
  },

  getDashboardStats: async (): Promise<NotificationDashboardStatsDto> => {
    const { data } = await apiClient.get<unknown>("/api/v1/notifications/dashboard/stats");
    const d = data as Record<string, unknown>;
    if (d.isSuccess !== undefined) {
      return (d.value || d.data) as NotificationDashboardStatsDto;
    }
    return (d.data || d) as NotificationDashboardStatsDto;
  },
};
