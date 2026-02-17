import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardService.getOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ["dashboard", "search", query],
    queryFn: () => dashboardService.search(query),
    enabled: query.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
