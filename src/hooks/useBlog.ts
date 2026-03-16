import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService, GetBlogsParams } from "@/services/blogService";
import { CreateBlogRequestDto, UpdateBlogRequestDto } from "@/types/blog";
import { useToastStore } from "@/stores/toastStore";

export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params: GetBlogsParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  stats: () => [...blogKeys.all, "stats"] as const,
};

// --- Queries ---
export const useBlogs = (params: GetBlogsParams) => {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogService.getBlogs(params),
  });
};

export const useBlogDetails = (id: string) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogService.getBlogDetails(id),
    enabled: !!id,
  });
};

export const useBlogStats = () => {
  return useQuery({
    queryKey: blogKeys.stats(),
    queryFn: () => blogService.getDashboardStats(),
  });
};

// --- Mutations ---
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: CreateBlogRequestDto) => blogService.createBlog(payload),
    onSuccess: () => {
      addToast("Blog created successfully", "success");
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to create blog", "error");
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogRequestDto }) =>
      blogService.updateBlog(id, payload),
    onSuccess: (_, variables) => {
      addToast("Blog updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to update blog", "error");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      addToast("Blog deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to delete blog", "error");
    },
  });
};

export const useBlogAction = (actionName: string) => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({ id, action, reason }: { id: string; action: "submit" | "approve" | "reject" | "publish" | "unpublish" | "feature" | "archive"; reason?: string }) => {
      switch (action) {
        case "submit": return blogService.submitBlog(id);
        case "approve": return blogService.approveBlog({ blogId: id, action: "Approve", reason: reason || "Approved", approvedBy: "System" });
        case "reject": return blogService.rejectBlog({ blogId: id, action: "Reject", reason: reason || "Rejected", approvedBy: "System" });
        case "publish": return blogService.publishBlog(id);
        case "unpublish": return blogService.unpublishBlog(id);
        case "feature": return blogService.featureBlog(id);
        case "archive": return blogService.archiveBlog(id);
        default: throw new Error("Invalid action");
      }
    },
    onSuccess: (_, variables) => {
      addToast(`Blog ${actionName} successfully`, "success");
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || `Failed to ${actionName} blog`, "error");
    },
  });
};
