// ─── Dashboard Types ───

export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isEnabled: boolean;
  order: number;
  permissions: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalProducts: number;
  pendingApprovals: number;
  activeKYCRequests: number;
  openSupportTickets: number;
}

export interface DashboardOverviewData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    profileImageUrl: string | null;
  };
  modules: DashboardModule[];
  stats: DashboardStats;
}

export interface DashboardOverviewResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    status: string;
    data: DashboardOverviewData;
  };
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  metadata: Record<string, unknown>;
}

export interface SearchResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    status: string;
    results: SearchResult[];
    totalCount: number;
  };
}
