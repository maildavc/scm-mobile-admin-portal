import apiClient from "@/lib/axios";
import {
  BlogListResponse,
  BlogResponse,
  CreateBlogRequestDto,
  UpdateBlogRequestDto,
  ApproveBlogDto,
  RejectBlogDto,
  BlogDashboardStatsDto,
} from "@/types/blog";

export interface GetBlogsParams {
  Page: number;
  Limit: number;
  [key: string]: string | number | boolean | undefined;
}

export const blogService = {
  getBlogs: async (params: GetBlogsParams): Promise<BlogListResponse> => {
    const { data } = await apiClient.get<BlogListResponse>("/api/v1/blog/posts", {
      params,
    });
    return data;
  },

  getBlogDetails: async (id: string): Promise<BlogResponse> => {
    const { data } = await apiClient.get<BlogResponse>(`/api/v1/blog/posts/${id}`);
    return data;
  },

  createBlog: async (payload: CreateBlogRequestDto): Promise<unknown> => {
    const { data } = await apiClient.post("/api/v1/blog/posts", payload);
    return data;
  },

  updateBlog: async (
    id: string,
    payload: UpdateBlogRequestDto
  ): Promise<unknown> => {
    const { data } = await apiClient.put(`/api/v1/blog/posts/${id}`, payload);
    return data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/blog/posts/${id}`);
  },

  submitBlog: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/blog/posts/${id}/submit`);
  },

  approveBlog: async (payload: ApproveBlogDto): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${payload.blogId}/approve`, payload);
  },

  rejectBlog: async (payload: RejectBlogDto): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${payload.blogId}/reject`, payload);
  },

  publishBlog: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${id}/publish`);
  },

  unpublishBlog: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${id}/unpublish`);
  },

  featureBlog: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${id}/feature`);
  },

  archiveBlog: async (id: string): Promise<void> => {
    await apiClient.put(`/api/v1/blog/posts/${id}/archive`);
  },

  getDashboardStats: async (): Promise<BlogDashboardStatsDto> => {
    const { data } = await apiClient.get<any>(`/api/v1/blog/dashboard/stats`);
    if (data.isSuccess !== undefined) {
       return data.value || data.data;
    }
    return data.data || data;
  },
};
