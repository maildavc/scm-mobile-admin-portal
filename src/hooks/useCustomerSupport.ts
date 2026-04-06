import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerSupportService, SendMessageCommand, CreateSupportRequestCommand } from "@/services/customerSupportService";
import { useToastStore } from "@/stores/toastStore";

export const CUSTOMER_SUPPORT_KEYS = {
  all: ["support-conversations"] as const,
  lists: () => [...CUSTOMER_SUPPORT_KEYS.all, "list"] as const,
  list: (page: number, search?: string) => [...CUSTOMER_SUPPORT_KEYS.lists(), { page, search }] as const,
  messages: (conversationId: string) => ["support-messages", conversationId] as const,
};

export const useSupportConversations = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: CUSTOMER_SUPPORT_KEYS.list(page, search),
    queryFn: () => customerSupportService.getSupportConversations(page, search),
  });
};

export const useConversationMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: CUSTOMER_SUPPORT_KEYS.messages(conversationId!),
    queryFn: () => customerSupportService.getConversationMessages(conversationId!),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (command: SendMessageCommand) =>
      customerSupportService.sendMessage(command),
    onSuccess: (data, variables) => {
      // Invalidate the specific conversation messages list
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_SUPPORT_KEYS.messages(variables.conversationId),
      });
      // Also invalidate the conversations list to update 'last message' etc if applicable
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_SUPPORT_KEYS.lists(),
      });
      addToast("Message sent successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send message",
        "error"
      );
    },
  });
};

export const useCreateSupportRequest = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (command: CreateSupportRequestCommand) =>
      customerSupportService.createSupportRequest(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_SUPPORT_KEYS.lists(),
      });
      addToast("Support request created successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create support request",
        "error"
      );
    },
  });
};
