import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  kycService, 
  ApproveKYCDocumentCommand, 
  RejectKYCDocumentCommand 
} from "@/services/kycService";
import { useToastStore } from "@/stores/toastStore";

export const KYC_KEYS = {
  all: ["kyc-requests"] as const,
  lists: () => [...KYC_KEYS.all, "list"] as const,
  documents: (customerId: string) => ["kyc-documents", customerId] as const,
};

export const useKycRequests = () => {
  return useQuery({
    queryKey: KYC_KEYS.lists(),
    queryFn: () => kycService.getPendingKycRequests(),
  });
};

export const useCustomerDocuments = (customerId: string | undefined) => {
  return useQuery({
    queryKey: KYC_KEYS.documents(customerId!),
    queryFn: () => kycService.getCustomerDocuments(customerId!),
    enabled: !!customerId,
  });
};

export const useApproveKycDocument = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ documentId, payload }: { documentId: string; payload: ApproveKYCDocumentCommand }) =>
      kycService.approveKycDocument(documentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.documents(variables.payload.customerId) });
      addToast("Document approved successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to approve document",
        "error"
      );
    },
  });
};

export const useRejectKycDocument = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ documentId, payload }: { documentId: string; payload: RejectKYCDocumentCommand }) =>
      kycService.rejectKycDocument(documentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.documents(variables.payload.customerId) });
      addToast("Document rejected successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reject document",
        "error"
      );
    },
  });
};
