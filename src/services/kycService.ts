import apiClient from "@/lib/axios";

// --- DTO Interfaces map directly to Swagger ---

export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface KYCRequestDto {
  id: string;
  customerId: string;
  customer?: CustomerDto;
  typeName: string;
  statusName: string;
  levelName: string;
  submittedAt: string;
  createdBy?: string;
  reviewedBy?: string;
  reviewerName?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CustomerDocumentDto {
  id: string;
  documentType: string;
  fileName: string;
  filePath: string;
  status: string;
  createdAt: string;
}

export interface CustomerDocumentsResponseDto {
  status: string;
  message: string;
  data: CustomerDocumentDto[];
}

export interface ApproveKYCDocumentCommand {
  customerId: string;
  notes?: string;
}

export interface RejectKYCDocumentCommand {
  customerId: string;
  reason: string;
}

export interface KYCActionResult {
  status: string;
  kycLevel: string;
  comments: string;
  updatedAt: string;
}

type BackendEnvelope<T> = {
  isSuccess: boolean;
  value: T;
  error?: unknown;
};

// --- Service Methods ---

export const kycService = {
  getPendingKycRequests: async (): Promise<KYCRequestDto[]> => {
    // Note: If pagination is added to this endpoint later, parameters map here.
    const { data } = await apiClient.get<BackendEnvelope<KYCRequestDto[]>>("/api/v1/kyc/requests");
    return data.value ?? (data as unknown as KYCRequestDto[]);
  },

  getCustomerDocuments: async (customerId: string): Promise<CustomerDocumentDto[]> => {
    // The endpoint theoretically accepts pagination ?Page=1&Limit=100
    const { data } = await apiClient.get<BackendEnvelope<CustomerDocumentsResponseDto>>(
      `/api/v1/customers/${customerId}/documents`,
      { params: { page: 1, limit: 100 } }
    );
    // Unwrap based on CustomerDocumentsResponseDto wrapper
    if (data.value && Array.isArray(data.value.data)) {
      return data.value.data;
    }
    const fallback = data as unknown as CustomerDocumentsResponseDto;
    return fallback?.data || [];
  },

  approveKycDocument: async (
    documentId: string,
    payload: ApproveKYCDocumentCommand
  ): Promise<KYCActionResult> => {
    const { data } = await apiClient.put<BackendEnvelope<KYCActionResult>>(
      `/api/v1/kyc/documents/${documentId}/approve`,
      payload
    );
    return data.value ?? (data as unknown as KYCActionResult);
  },

  rejectKycDocument: async (
    documentId: string,
    payload: RejectKYCDocumentCommand
  ): Promise<KYCActionResult> => {
    const { data } = await apiClient.put<BackendEnvelope<KYCActionResult>>(
      `/api/v1/kyc/documents/${documentId}/reject`,
      payload
    );
    return data.value ?? (data as unknown as KYCActionResult);
  }
};
