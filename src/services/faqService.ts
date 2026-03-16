import apiClient from "@/lib/axios";
import {
  FAQListResponse,
  FAQDto,
  CreateFAQRequestDto,
  UpdateFAQRequestDto,
  ApproveFaqDto,
  RejectFaqDto,
  FAQDashboardStatsDto,
} from "@/types/faq";

export interface GetFAQsParams {
  Page: number;
  PageSize: number;
  [key: string]: any;
}

export const faqService = {
  getFAQs: async (params: GetFAQsParams): Promise<FAQListResponse> => {
    const { data } = await apiClient.get<FAQListResponse>("/api/v1/faq", {
      params,
    });
    return data;
  },

  getFAQDetails: async (id: string): Promise<FAQDto> => {
    const { data } = await apiClient.get<any>(`/api/v1/faq/${id}`);
    
    // Check if wrapped in standard envelope
    if (data.isSuccess !== undefined) {
       return data.value || data.data;
    }
    return data.data || data;
  },

  createFAQ: async (payload: CreateFAQRequestDto): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/faq", payload);
    return data;
  },

  updateFAQ: async (
    id: string,
    payload: UpdateFAQRequestDto
  ): Promise<any> => {
    const { data } = await apiClient.put(`/api/v1/faq/${id}`, payload);
    return data;
  },

  deleteFAQ: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/faq/${id}`);
  },

  submitFAQ: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/faq/${id}/submit`);
  },

  approveFAQ: async (payload: ApproveFaqDto): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${payload.id}/approve`, payload);
  },

  rejectFAQ: async (payload: RejectFaqDto): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${payload.id}/reject`, payload);
  },

  publishFAQ: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${id}/publish`);
  },

  unpublishFAQ: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${id}/unpublish`);
  },

  featureFAQ: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${id}/feature`);
  },

  archiveFAQ: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/faq/${id}/archive`);
  },

  getDashboardStats: async (): Promise<FAQDashboardStatsDto> => {
    const { data } = await apiClient.get<any>(`/api/v1/faq/dashboard/stats`);
    if (data.isSuccess !== undefined) {
       return data.value || data.data;
    }
    return data.data || data;
  },
};
