"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import { KYCRequest } from "@/constants/kycVerification/kycVerification";
import { useCustomerDocuments, useApproveKycDocument, useRejectKycDocument } from "@/hooks/useKyc";
import { formatDateToMMMdyyyy, formatTimeTohmma } from "@/utils/dateFormatter";

interface ViewKYCRequestProps {
  request: KYCRequest;
  onApprove: () => void;
  onReject: () => void;
  onBack: () => void;
}

const DetailRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}) => (
  <div
    className={`flex justify-between items-start gap-4 py-2 ${
      !isLast ? "border-b border-[#F4F4F5]" : ""
    }`}
  >
    <span className="text-sm text-[#2F3140]">{label}</span>
    <div className="text-sm text-[#707781] font-medium text-right max-w-[65%]">{value}</div>
  </div>
);

const ViewKYCRequest: React.FC<ViewKYCRequestProps> = ({ request, onApprove, onReject }) => {
  const { data: documents = [], isLoading: isLoadingDocs } = useCustomerDocuments(
    request.customerId,
  );
  const { mutate: approveDoc, isPending: isApproving } = useApproveKycDocument();
  const { mutate: rejectDoc, isPending: isRejecting } = useRejectKycDocument();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState<"review" | "success" | "rejected">("review");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const handleApproveConfirm = () => {
    if (!selectedDocId) return;
    approveDoc(
      { documentId: selectedDocId, payload: { customerId: request.customerId } },
      {
        onSuccess: () => {
          setIsApproveModalOpen(false);
          setViewStatus("success");
        },
      },
    );
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedDocId) return;
    rejectDoc(
      { documentId: selectedDocId, payload: { customerId: request.customerId, reason } },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setViewStatus("rejected");
        },
      },
    );
  };

  const handleDocumentAction = (id: string, action: "Approve" | "Reject") => {
    setSelectedDocId(id);
    if (action === "Approve") {
      setIsApproveModalOpen(true);
    } else {
      setIsRejectModalOpen(true);
    }
  };

  if (viewStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">KYC Verification Approved</h2>
        <p className="text-sm text-[#707781] mb-8 text-center max-w-md">
          KYC verification was successfully approved.
        </p>
        <div className="w-32">
          <Button
            text="Done"
            variant="primary"
            onClick={onApprove}
            className="bg-[#B2171E] font-bold"
          />
        </div>
      </div>
    );
  }

  if (viewStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">KYC Verification Rejected</h2>
        <p className="text-sm text-[#707781] mb-8 text-center max-w-md">
          KYC verification was successfully rejected.
        </p>
        <div className="w-32">
          <Button
            text="Done"
            variant="primary"
            onClick={onReject}
            className="bg-[#B2171E] font-bold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApproveConfirm}
        title="Approve Document?"
        description="Are you sure you want to approve this document?"
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleRejectConfirm}
        title="Reject Document?"
        description="Are you sure you want to reject this document?"
        isSubmitting={isRejecting}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#F4F4F5] p-6">
          <h3 className="text-base font-bold text-[#2F3140] mb-4">Request Details</h3>
          <DetailRow label="Customer" value={request.customer.name} />
          <DetailRow label="Email" value={request.customer.email} />
          <DetailRow label="Verification Type" value={request.verificationType} />
          <DetailRow
            label="Status"
            value={<StatusBadge status={(request.status || "Pending Verification") as StatusType} />}
          />
          <DetailRow label="Initiated By" value={request.initiatedBy.name} />
          <DetailRow label="Date Requested" value={request.dateRequested} isLast={!request.reviewedBy && !request.rejectionReason} />
          {request.reviewedBy ? (
            <DetailRow
              label="Reviewed By"
              value={request.reviewedBy}
              isLast={!request.rejectionReason}
            />
          ) : null}
          {request.rejectionReason ? (
            <DetailRow label="Rejection Reason" value={request.rejectionReason} isLast />
          ) : null}
        </div>

        <div className="bg-white rounded-lg border border-[#F4F4F5] p-6">
          <h3 className="text-base font-bold text-[#2F3140] mb-4">Review Tips</h3>
          <p className="text-sm text-[#707781] leading-6">
            Open each submitted document, confirm it matches the customer profile, then approve or
            reject from the documents list. Request-level actions are handled per document.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 max-w-4xl w-full">
        <h3 className="text-base font-bold text-[#2F3140] mb-6">KYC Documents</h3>

        <div className="flex flex-col gap-4">
          {isLoadingDocs ? (
            <p className="text-sm text-gray-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500">
              No documents found for this customer. Documents will appear here once the customer
              uploads identity files.
            </p>
          ) : (
            documents.map((doc) => {
              const isPending = doc.status === "Pending";
              const isApproved = doc.status === "Approved";
              const isRejected = doc.status === "Rejected";

              return (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-[#707781]">{doc.documentType || "Document File"}</p>
                    <p className="text-sm font-bold text-[#2F3140]">{doc.fileName || doc.id}</p>
                    <p className="text-xs text-[#707781]">
                      Added: {formatDateToMMMdyyyy(doc.createdAt)} {formatTimeTohmma(doc.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <Button
                      text="View File"
                      variant="outline"
                      onClick={() => window.open(doc.filePath, "_blank", "noopener,noreferrer")}
                      disabled={!doc.filePath}
                      className="w-auto! px-6! py-2! font-semibold text-sm md:text-base"
                    />

                    {isPending && (
                      <>
                        <Button
                          text={isRejecting && selectedDocId === doc.id ? "Rejecting..." : "Reject"}
                          variant="outline"
                          onClick={() => handleDocumentAction(doc.id, "Reject")}
                          disabled={isRejecting || isApproving}
                          className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                        />
                        <Button
                          text={
                            isApproving && selectedDocId === doc.id ? "Approving..." : "Approve"
                          }
                          variant="outline"
                          onClick={() => handleDocumentAction(doc.id, "Approve")}
                          disabled={isRejecting || isApproving}
                          className="w-auto! px-6! py-2! text-[#29C680]! font-semibold text-sm md:text-base"
                        />
                      </>
                    )}

                    {isApproved && (
                      <Button
                        text="Approved"
                        variant="outline"
                        className="w-auto! px-6! py-2! text-[#29C680]! font-semibold text-sm md:text-base"
                      />
                    )}

                    {isRejected && (
                      <Button
                        text="Rejected"
                        variant="outline"
                        className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewKYCRequest;
