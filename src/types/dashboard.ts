// ─── Dashboard Types ───

export interface DashboardModule {
  name: string;
  icon: string;
  description: string;
  route: string;
  count?: number;
  trend?: string;
}

export interface DashboardOverviewResponse {
  status: string;
  message: string;
  data: {
    modules: DashboardModule[];
    totalCustomers: number;
    totalProducts: number;
    totalUsers: number;
    pendingApprovals: number;
    recentActivities: Array<{
      id: string;
      action: string;
      user: string;
      timestamp: string;
      module: string;
    }>;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  module: string;
  type: string;
  url: string;
}

export interface SearchResponse {
  status: string;
  data: SearchResult[];
  totalCount: number;
}
