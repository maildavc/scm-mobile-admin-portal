import apiClient from "@/lib/axios";

// Types based on the Swagger DTOs
export interface SupportConversation {
  id: string;
  subject: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  priority: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface SupportConversationListResponse {
  items: SupportConversation[];
  totalCount: number;
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: string;
  message: string;
  createdAt: string;
}

export interface ConversationMessagesResponse {
  conversation: SupportConversation;
  messages: SupportMessage[];
}

export interface SendMessageCommand {
  conversationId: string;
  message: string;
}

export interface CreateSupportRequestCommand {
  subject: string;
  message: string;
  priority: string;
}

type BackendEnvelope<T> = {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: unknown;
  errors: unknown;
};

export const customerSupportService = {
  getSupportConversations: async (
    page: number = 1,
    search?: string
  ): Promise<SupportConversationListResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<SupportConversationListResponse>>(
      "/api/v1/support-requests/messages",
      { params: { page, search } }
    );
    return data.value ?? (data as unknown as SupportConversationListResponse);
  },

  getConversationMessages: async (
    conversationId: string
  ): Promise<ConversationMessagesResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<ConversationMessagesResponse>>(
      `/api/v1/support-requests/${conversationId}/messages`
    );
    return data.value ?? (data as unknown as ConversationMessagesResponse);
  },

  sendMessage: async (
    command: SendMessageCommand
  ): Promise<SupportMessage> => {
    const { data } = await apiClient.post<BackendEnvelope<SupportMessage>>(
      `/api/v1/support-requests/${command.conversationId}/messages`,
      command
    );
    return data.value ?? (data as unknown as SupportMessage);
  },

  createSupportRequest: async (
    command: CreateSupportRequestCommand
  ): Promise<SupportConversation> => {
    const { data } = await apiClient.post<BackendEnvelope<SupportConversation>>(
      "/api/v1/support-requests",
      command
    );
    return data.value ?? (data as unknown as SupportConversation);
  }
};
