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

type RawSupportMessage = Partial<SupportMessage> & {
  content?: string;
  sentAt?: string;
};

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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeConversation(row: Partial<SupportConversation> | undefined): SupportConversation {
  return {
    id: row?.id || "",
    subject: row?.subject || "",
    customerId: row?.customerId || "",
    customerName: row?.customerName || row?.subject || "Customer",
    customerEmail: row?.customerEmail || "",
    status: row?.status || "",
    priority: row?.priority || "",
    lastMessageAt: row?.lastMessageAt || row?.createdAt || "",
    createdAt: row?.createdAt || "",
  };
}

function normalizeMessage(row: RawSupportMessage | undefined): SupportMessage {
  return {
    id: row?.id || "",
    conversationId: row?.conversationId || "",
    senderId: row?.senderId || "",
    senderName: row?.senderName || "",
    senderType: row?.senderType || "",
    message: row?.message || row?.content || "",
    createdAt: row?.createdAt || row?.sentAt || "",
  };
}

export const customerSupportService = {
  getSupportConversations: async (
    page: number = 1,
    search?: string,
  ): Promise<SupportConversationListResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<unknown>>(
      "/api/v1/support-requests/messages",
      { params: { page, search } },
    );
    const payload = asRecord(data.value ?? data);
    const rows = (Array.isArray(payload.items) ? payload.items : payload.data) as
      | Partial<SupportConversation>[]
      | undefined;

    const items = Array.isArray(rows) ? rows.map(normalizeConversation) : [];

    return {
      items,
      totalCount: Number(payload.totalCount || items.length),
      pageNumber: Number(payload.pageNumber || page),
      totalPages: Number(payload.totalPages || 1),
      hasPreviousPage: Boolean(payload.hasPreviousPage),
      hasNextPage: Boolean(payload.hasNextPage),
    };
  },

  getConversationMessages: async (
    conversationId: string,
  ): Promise<ConversationMessagesResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<unknown>>(
      `/api/v1/support-requests/${conversationId}/messages`,
    );
    const payload = asRecord(data.value ?? data);
    const nested = asRecord(payload.data);
    const source = nested.messages || nested.conversation ? nested : payload;

    return {
      conversation: normalizeConversation(
        (source.conversation as Partial<SupportConversation> | undefined) ||
          (payload.conversation as Partial<SupportConversation> | undefined),
      ),
      messages: Array.isArray(source.messages)
        ? (source.messages as RawSupportMessage[]).map(normalizeMessage)
        : Array.isArray(payload.messages)
          ? (payload.messages as RawSupportMessage[]).map(normalizeMessage)
          : [],
    };
  },

  sendMessage: async (command: SendMessageCommand): Promise<SupportMessage> => {
    const { data } = await apiClient.post<BackendEnvelope<SupportMessage>>(
      `/api/v1/support-requests/${command.conversationId}/messages`,
      command,
    );
    return data.value ?? (data as unknown as SupportMessage);
  },

  createSupportRequest: async (
    command: CreateSupportRequestCommand,
  ): Promise<SupportConversation> => {
    const { data } = await apiClient.post<BackendEnvelope<SupportConversation>>(
      "/api/v1/support-requests",
      command,
    );
    return data.value ?? (data as unknown as SupportConversation);
  },
};
