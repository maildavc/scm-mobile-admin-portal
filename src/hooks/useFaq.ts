import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faqService, GetFAQsParams } from "@/services/faqService";
import { CreateFAQRequestDto, UpdateFAQRequestDto } from "@/types/faq";
import { useToastStore } from "@/stores/toastStore";

export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: (params: GetFAQsParams) => [...faqKeys.lists(), params] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: string) => [...faqKeys.details(), id] as const,
  stats: () => [...faqKeys.all, "stats"] as const,
};

// --- Queries ---
export const useFAQs = (params: GetFAQsParams) => {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: () => faqService.getFAQs(params),
  });
};

export const useFAQDetails = (id: string) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqService.getFAQDetails(id),
    enabled: !!id,
  });
};

export const useFAQStats = () => {
  return useQuery({
    queryKey: faqKeys.stats(),
    queryFn: () => faqService.getDashboardStats(),
  });
};

// --- Mutations ---
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: CreateFAQRequestDto) => faqService.createFAQ(payload),
    onSuccess: () => {
      addToast("FAQ created successfully", "success");
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to create FAQ", "error");
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFAQRequestDto }) =>
      faqService.updateFAQ(id, payload),
    onSuccess: (_, variables) => {
      addToast("FAQ updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: faqKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to update FAQ", "error");
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => faqService.deleteFAQ(id),
    onSuccess: () => {
      addToast("FAQ deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || "Failed to delete FAQ", "error");
    },
  });
};

export const useFAQAction = (actionName: string) => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({ id, action, reason }: { id: string; action: "submit" | "approve" | "reject" | "publish" | "unpublish" | "feature" | "archive"; reason?: string }) => {
      switch (action) {
        case "submit": return faqService.submitFAQ(id);
        case "approve": return faqService.approveFAQ({ id, publishImmediately: true });
        case "reject": return faqService.rejectFAQ({ id, reason: reason || "Rejected" });
        case "publish": return faqService.publishFAQ(id);
        case "unpublish": return faqService.unpublishFAQ(id);
        case "feature": return faqService.featureFAQ(id);
        case "archive": return faqService.archiveFAQ(id);
        default: throw new Error("Invalid action");
      }
    },
    onSuccess: (_, variables) => {
      addToast(`FAQ ${actionName} successfully`, "success");
      queryClient.invalidateQueries({ queryKey: faqKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      addToast(error?.response?.data?.message || `Failed to ${actionName} FAQ`, "error");
    },
  });
};
