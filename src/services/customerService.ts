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

export const customerService = {
  getCustomers: async (
    params: GetCustomersParams,
  ): Promise<GetCustomersResponse> => {
    const { data } = await apiClient.get<BackendEnvelope<GetCustomersResponse>>(
      "/api/v1/customers",
      { params },
    );
    // Unwrap the outer envelope — actual payload is in .value
    return data.value ?? (data as unknown as GetCustomersResponse);
  },

  createCustomer: async (
    payload: CreateCustomerRequest,
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.post<
      BackendEnvelope<SingleCustomerResponse>
    >("/api/v1/customers", payload);
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  getCustomerDetails: async (
    customerId: string,
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.get<
      BackendEnvelope<SingleCustomerResponse>
    >(`/api/v1/customers/${customerId}`);
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  updateCustomer: async (
    customerId: string,
    payload: UpdateCustomerRequest,
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.put<
      BackendEnvelope<SingleCustomerResponse>
    >(`/api/v1/customers/${customerId}`, payload);
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  approveRejectCustomer: async (
    customerId: string,
    action: "approve" | "reject",
  ): Promise<SingleCustomerResponse> => {
    const { data } = await apiClient.patch<
      BackendEnvelope<SingleCustomerResponse>
    >(`/api/v1/customers/${customerId}/approve`, {
      customerId,
      action,
    });
    return data.value ?? (data as unknown as SingleCustomerResponse);
  },

  resendEmailVerification: async (
    customerId: string,
  ): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.post<
      BackendEnvelope<SimpleActionResponse>
    >(`/api/v1/customers/${customerId}/resend-email-verification`);
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  resetCustomerPassword: async (
    customerId: string,
  ): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.post<
      BackendEnvelope<SimpleActionResponse>
    >(`/api/v1/customers/${customerId}/reset-password`);
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  deactivateCustomer: async (
    customerId: string,
    reason: string,
  ): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.patch<
      BackendEnvelope<SimpleActionResponse>
    >(`/api/v1/customers/${customerId}/deactivate`, {
      customerId,
      reason,
    });
    return data.value ?? (data as unknown as SimpleActionResponse);
  },

  updateCustomerProducts: async (
    customerId: string,
    productIds: string[],
  ): Promise<SimpleActionResponse> => {
    const { data } = await apiClient.patch<
      BackendEnvelope<SimpleActionResponse>
    >(`/api/v1/customers/${customerId}/products`, {
      customerId,
      productIds,
    });
    return data.value ?? (data as unknown as SimpleActionResponse);
  },
};
