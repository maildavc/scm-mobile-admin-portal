import apiClient from "@/lib/axios";
import type {
  GetCustomersParams,
  GetCustomersResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  SingleCustomerResponse,
  SimpleActionResponse,
} from "@/types/customer";

// Backend wraps responses: { isSuccess, isFailure, value: <actual payload>, error, errors }
type BackendEnvelope<T> = {
  isSuccess: boolean;
  isFailure: boolean;
  value: T;
  error: unknown;
  errors: unknown;
};

export interface CustomerCardDto {
  cardId?: string;
  maskedCardNumber?: string;
  cardType?: string;
  status?: string;
  addedAt?: string;
}

export interface CustomerPaymentDto {
  paymentId?: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
  date?: string;
}

export interface CustomerActivityLogDto {
  action?: string;
  description?: string;
  performedBy?: string;
  performedAt?: string;
}

type CustomerTabListResponse<T> = {
  status?: string;
  message?: string;
  data?: T[];
};

function unwrapTabList<T>(data: BackendEnvelope<CustomerTabListResponse<T>> | CustomerTabListResponse<T>): T[] {
  const payload = (data as BackendEnvelope<CustomerTabListResponse<T>>).value ?? data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray((payload as CustomerTabListResponse<T>).data)) {
    return (payload as CustomerTabListResponse<T>).data || [];
  }
  return [];
}

export const customerService = {
  getCustomers: async (params: GetCustomersParams): Promise<GetCustomersResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<GetCustomersResponse>>(
      "/api/v1/customers",
      { params },
    );
    // Unwrap the outer envelope — actual payload is in .value
    return data.value ?? (data as unknown as GetCustomersResponse);
  },

  createCustomer: async (payload: CreateCustomerRequest): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.post<BackendEnvelope<SingleCustomerResponse>>(
      "/api/v1/customers",
      payload,
    );
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  getCustomerDetails: async (customerId: string): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<SingleCustomerResponse>>(
      `/api/v1/customers/${customerId}`,
    );
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  updateCustomer: async (
    customerId: string,
    payload: UpdateCustomerRequest,
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.put<BackendEnvelope<SingleCustomerResponse>>(
      `/api/v1/customers/${customerId}`,
      payload,
    );
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  approveRejectCustomer: async (
    customerId: string,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.patch<BackendEnvelope<SingleCustomerResponse>>(
      `/api/v1/customers/${customerId}/approve`,
      {
        customerId,
        action,
        ...(reason ? { reason } : {}),
      },
    );
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  resendEmailVerification: async (customerId: string): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.post<BackendEnvelope<SimpleActionResponse>>(
      `/api/v1/customers/${customerId}/resend-email-verification`,
      {},
    );
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  resetCustomerPassword: async (customerId: string): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.post<BackendEnvelope<SimpleActionResponse>>(
      `/api/v1/customers/${customerId}/reset-password`,
      {},
    );
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  deactivateCustomer: async (customerId: string, reason: string): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.patch<BackendEnvelope<SimpleActionResponse>>(
      `/api/v1/customers/${customerId}/deactivate`,
      {
        customerId,
        reason,
      },
    );
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  getCustomerCards: async (customerId: string): Promise<CustomerCardDto[]> => {
    const { data } = await apiClient.get<BackendEnvelope<CustomerTabListResponse<CustomerCardDto>>>(
      `/api/v1/customers/${customerId}/cards`,
      { params: { page: 1, limit: 100 } },
    );
    return unwrapTabList(data);
  },

  getCustomerPayments: async (customerId: string): Promise<CustomerPaymentDto[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<CustomerTabListResponse<CustomerPaymentDto>>
    >(`/api/v1/customers/${customerId}/payments`, { params: { page: 1, limit: 100 } });
    return unwrapTabList(data);
  },

  getCustomerActivityLogs: async (customerId: string): Promise<CustomerActivityLogDto[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<CustomerTabListResponse<CustomerActivityLogDto>>
    >(`/api/v1/customers/${customerId}/activity-logs`, { params: { page: 1, limit: 100 } });
    return unwrapTabList(data);
  },

  updateCustomerProducts: async (
    customerId: string,
    productIds: string[],
  ): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.patch<BackendEnvelope<SimpleActionResponse>>(
      `/api/v1/customers/${customerId}/products`,
      {
        customerId,
        productIds,
      },
    );
    return data.value ?? (data as unknown as SimpleActionResponse);
  },
};
