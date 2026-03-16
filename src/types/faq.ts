export enum FAQCategory {
  General = 1,
  Account = 2,
  AccountManagement = 3,
  Investment = 4,
  Security = 5,
  Technical = 6,
  Billing = 7,
  Support = 8,
  Legal = 9,
}

export enum FAQStatus {
  Draft = 1,
  AwaitingApproval = 2,
  Approved = 3,
  Rejected = 4,
  Published = 5,
  Archived = 6,
}

export interface FAQDto {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory | number;
  categoryName: string;
  status: FAQStatus | number;
  statusName: string;
  isPublished: boolean;
  audienceType: string | null;
  whenShouldItGoLive: string | null;
  scheduleDate: string | null;
  isFeatured: boolean;
  displayOrder: number;
  tags: string | null;
  keywords: string | null;
  publishedAt: string | null;
  approvedBy: string | null;
  approverName: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectorName: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  reviewNotes: string | null;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulnessRatio: number;
  canBePublished: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  authorName: string | null;
  updatedBy: string | null;
}

export interface CreateFAQRequestDto {
  question: string;
  answer: string;
  category: FAQCategory | number;
  audienceType?: string;
  whenShouldItGoLive?: string;
  scheduleDate?: string;
}

export interface UpdateFAQRequestDto {
  question?: string;
  answer?: string;
  category?: FAQCategory | number;
  whenShouldItGoLive?: string;
  scheduleDate?: string;
  tags?: string;
  keywords?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface FAQListResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    items: FAQDto[];
    totalCount: number;
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    stats: Record<string, unknown>;
  };
  error: string | null;
  items?: FAQDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ApproveFaqDto {
  id: string;
  notes?: string;
  publishImmediately?: boolean;
}

export interface RejectFaqDto {
  id: string;
  reason: string;
  notes?: string;
}

export interface FAQAudienceStats {
  totalFAQs: number;
  draftFAQs: number;
  awaitingApprovalFAQs: number;
  approvedFAQs: number;
  rejectedFAQs: number;
  publishedFAQs: number;
  featuredFAQs: number;
  totalViews: number;
  totalHelpfulVotes: number;
  totalNotHelpfulVotes: number;
}

export interface FAQDashboardStatsDto {
  totalFAQs: number;
  draftFAQs: number;
  awaitingApprovalFAQs: number;
  approvedFAQs: number;
  rejectedFAQs: number;
  publishedFAQs: number;
  featuredFAQs: number;
  totalViews: number;
  totalHelpfulVotes: number;
  totalNotHelpfulVotes: number;
  totalFeedback: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  averageHelpfulnessRatio: number;
  overallHelpfulnessRatio: number;
  faQsCreatedToday: number;
  faQsCreatedThisWeek: number;
  faQsCreatedThisMonth: number;
  mostViewedFAQs: any[];
  mostHelpfulFAQs: any[];
  categoryStats: any[];
  allFAQs: FAQAudienceStats;
  homepageFAQs: FAQAudienceStats;
  productFAQs: FAQAudienceStats;
}
