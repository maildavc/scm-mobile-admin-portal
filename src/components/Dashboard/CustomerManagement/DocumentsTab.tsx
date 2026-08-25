"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import DocumentPreviewModal from "@/components/Dashboard/KYCVerification/DocumentPreviewModal";
import { useCustomerDocuments } from "@/hooks/useKyc";
import type { CustomerDocumentDto } from "@/services/kycService";
import { formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";
import { formatDocumentType } from "@/types/kyc";
import { toKycBadgeStatus } from "@/utils/kycStatus";

interface DocumentsTabProps {
  customerId?: string;
  mode?: "view" | "approval";
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ customerId }) => {
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
  } = useCustomerDocuments(customerId);
  const [previewDoc, setPreviewDoc] = useState<CustomerDocumentDto | null>(null);

  const errorMessage =
    (error as { response?: { data?: { message?: string; error?: string } }; message?: string })
      ?.response?.data?.message ||
    (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
    (error as { message?: string })?.message ||
    "Unable to load documents for this customer.";

  return (
    <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 max-w-4xl w-full">
      <h3 className="text-base font-bold text-[#2F3140] mb-6">KYC Documents</h3>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading documents...</p>
      ) : isError ? (
        <p className="text-sm text-[#B2171E]">{errorMessage}</p>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[#707781] text-sm">
          <p>No documents were returned for this customer.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#707781]">{formatDocumentType(doc.documentType)}</p>
                <p className="text-sm font-bold text-[#2F3140]">{doc.fileName || doc.id}</p>
                <p className="text-xs text-[#707781]">Added: {formatDateTimeDdMmYyyy(doc.createdAt)}</p>
                <StatusBadge
                  status={toKycBadgeStatus(doc.status) as StatusType}
                  displayLabel={doc.status || "Pending"}
                />
              </div>
              <Button
                text="View File"
                variant="outline"
                onClick={() => setPreviewDoc(doc)}
                disabled={!doc.filePath}
                className="w-auto! px-6! py-2! font-semibold text-sm"
              />
            </div>
          ))}
        </div>
      )}
      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        fileName={previewDoc?.fileName}
        filePath={previewDoc?.filePath}
        documentType={previewDoc?.documentType}
        status={previewDoc?.status}
      />
    </div>
  );
};

export default DocumentsTab;
