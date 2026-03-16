export enum BlogStatus {
  Draft = "Draft",
  AwaitingApproval = "AwaitingApproval",
  Approved = "Approved",
  Rejected = "Rejected",
  Published = "Published",
  Archived = "Archived",
}

export interface BlogListDto {
  id: string;
  title: string;
  author: string;
  status: BlogStatus | string;
  audienceType: string | null;
  whenShouldItGoLive: string | null;
  scheduleDate: string | null;
  createdAt: string;
}

export interface BlogDto {
  id: string;
  title: string;
  content: string;
  author: string;
  status: BlogStatus | string;
  audienceType: string | null;
  whenShouldItGoLive: string | null;
  scheduleDate: string | null;
  createdAt: string;
  modifiedAt: string | null;
}

export interface CreateBlogRequestDto {
  title: string;
  content: string;
  category: string;
  audienceType?: string;
  whenShouldItGoLive?: string;
  scheduleDate?: string;
  createdBy?: string;
}

export interface UpdateBlogRequestDto {
  title?: string;
  content?: string;
  category?: string;
  audienceType?: string;
  whenShouldItGoLive?: string;
  scheduleDate?: string;
}

export interface BlogListResponse {
  status: string;
  message: string;
  data: BlogListDto[];
  totalCount?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface BlogResponse {
  status: string;
  message: string;
  data: BlogDto;
}

export interface ApproveBlogDto {
  blogId: string;
  action: string;
  reason?: string;
  approvedBy?: string;
}

export interface RejectBlogDto {
  blogId: string;
  action: string;
  reason: string;
  approvedBy?: string;
}

export interface BlogAudienceStats {
  totalPosts: number;
  draftPosts: number;
  awaitingApprovalPosts: number;
  approvedPosts: number;
  publishedPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
}

export interface BlogDashboardStatsDto {
  totalPosts: number;
  draftPosts: number;
  awaitingApprovalPosts: number;
  approvedPosts: number;
  publishedPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  pendingComments: number;
  postsThisMonth: number;
  averageEngagementRate: number;
  allBlogs: BlogAudienceStats;
  homepageBlogs: BlogAudienceStats;
  productBlogs: BlogAudienceStats;
}
