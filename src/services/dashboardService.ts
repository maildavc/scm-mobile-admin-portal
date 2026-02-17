import apiClient from "@/lib/axios";
import type {
  DashboardOverviewResponse,
  SearchResponse,
} from "@/types/dashboard";

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    const { data } = await apiClient.get<DashboardOverviewResponse>(
      "/api/v1/dashboard/overview",
    );
    return data;
  },

  search: async (query: string): Promise<SearchResponse> => {
    const { data } = await apiClient.get<SearchResponse>(
      "/api/v1/dashboard/search",
      { params: { query } },
    );
    return data;
  },
};
