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
  documentType: string | number;
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
  success?: boolean;
  message?: string;
  status?: string;
  kycLevel?: string;
  kycRequestId?: string;
  comments?: string;
  updatedAt?: string;
  actionTimestamp?: string;
  newStatus?: number | string;
  errors?: string[];
}

type BackendEnvelope<T> = {
  isSuccess: boolean;
  value: T;
  error?: unknown;
};

function unwrapActionResult(
  data: BackendEnvelope<KYCActionResult> | KYCActionResult,
): KYCActionResult {
  const result = (data as BackendEnvelope<KYCActionResult>).value ?? (data as KYCActionResult);
  if (result && result.success === false) {
    const error = new Error(result.message || result.errors?.[0] || "KYC action failed");
    (error as { response?: { data?: KYCActionResult } }).response = { data: result };
    throw error;
  }
  return result;
}

// --- Service Methods ---

export const kycService = {
  getPendingKycRequests: async (): Promise<KYCRequestDto[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<KYCRequestDto[] | { data?: KYCRequestDto[]; totalCount?: number }>
    >("/api/v1/kyc/requests");

    const payload = data.value ?? (data as unknown as KYCRequestDto[] | { data?: KYCRequestDto[] });
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  },

  getCustomerDocuments: async (customerId: string): Promise<CustomerDocumentDto[]> => {
    const { data } = await apiClient.get<
      BackendEnvelope<CustomerDocumentsResponseDto | CustomerDocumentDto[]>
    >(`/api/v1/customers/${customerId}/documents`, {
      params: { page: 1, limit: 100 },
    });

    const payload =
      data.value ?? (data as unknown as CustomerDocumentsResponseDto | CustomerDocumentDto[]);
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as CustomerDocumentsResponseDto).data)) {
      return (payload as CustomerDocumentsResponseDto).data;
    }
    return [];
  },

  approveKycDocument: async (
    documentId: string,
    payload: ApproveKYCDocumentCommand,
  ): Promise<KYCActionResult> => {
    const { data } = await apiClient.put<BackendEnvelope<KYCActionResult>>(
      `/api/v1/kyc/documents/${encodeURIComponent(documentId)}/approve`,
      payload,
    );
    return unwrapActionResult(data);
  },

  rejectKycDocument: async (
    documentId: string,
    payload: RejectKYCDocumentCommand,
  ): Promise<KYCActionResult> => {
    const { data } = await apiClient.put<BackendEnvelope<KYCActionResult>>(
      `/api/v1/kyc/documents/${encodeURIComponent(documentId)}/reject`,
      payload,
    );
    return unwrapActionResult(data);
  },
};
