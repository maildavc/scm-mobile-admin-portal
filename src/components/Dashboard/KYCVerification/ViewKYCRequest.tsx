"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import { KYCRequest } from "@/constants/kycVerification/kycVerification";

interface ViewKYCRequestProps {
  request: KYCRequest;
  onApprove: () => void;
  onReject: () => void;
  onBack: () => void;
}

// Mock documents for the view
const MOCK_DOCUMENTS = [
  {
    id: "1",
    type: "Document File",
    name: "Signature",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Pending",
  },
  {
    id: "2",
    type: "Document File",
    name: "Utility Bill",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Approved",
  },
  {
    id: "3",
    type: "Document File",
    name: "Other Document",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Rejected",
  },
  {
    id: "4",
    type: "Document File",
    name: "ID Card",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Pending",
  },
];

const ViewKYCRequest: React.FC<ViewKYCRequestProps> = ({
  request,
  onApprove,
  onReject,
  onBack,
}) => {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState<
    "review" | "success" | "rejected"
  >("review");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Handle global approval (e.g. from footer buttons or after document check)
  const handleApproveConfirm = () => {
    setIsApproveModalOpen(false);
    setViewStatus("success");
  };

  const handleRejectConfirm = (reason: string) => {
    setIsRejectModalOpen(false);
    console.log("Rejection reason:", reason);
    setViewStatus("rejected");
  };

  // Handle per-document actions
  const handleDocumentAction = (id: string, action: "Approve" | "Reject") => {
    // For now, let's just update the local state to show interactivity
    // In a real app, this might trigger the global modal if it's the last document, etc.
    // The user said "when approve or reject is clicked it shows the modals".
    // So let's make the document buttons trigger the modals too, or at least a specific document modal.
    // For simplicity and to match the user's likely intent of "testing the flow",
    // I'll make ANY approve/reject action trigger the main modal flow for now,
    // OR just update the status locally.

    // User said: "when approve or reject is clicked it shows the modals and success screen"
    // This implies a decisive action.
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
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          KYC Verification Approved
        </h2>
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
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          KYC Verification Rejected
        </h2>
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
    <div className="flex flex-col h-full relative">
      {/* Breadcrumbs and Header are handled by the page wrapper usually, but we need the specific customer name header here if we replace the main content */}

      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApproveConfirm}
        title={selectedDocId ? "Approve Document?" : "Approve KYC Request?"}
        description={
          selectedDocId
            ? "Are you sure you want to approve this document?"
            : "Are you sure you want to approve this KYC request?"
        }
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleRejectConfirm}
        title={selectedDocId ? "Reject Document?" : "Reject KYC Request?"}
        description={
          selectedDocId
            ? "Are you sure you want to reject this document?"
            : "Are you sure you want to reject this KYC request?"
        }
      />

      <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 max-w-4xl w-full">
        <h3 className="text-base font-bold text-[#2F3140] mb-6">
          KYC Documents
        </h3>

        <div className="flex flex-col gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#707781]">{doc.type}</p>
                <p className="text-sm font-bold text-[#2F3140]">{doc.name}</p>
                <p className="text-xs text-[#707781]">Added: {doc.addedDate}</p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  text="View File"
                  variant="outline"
                  onClick={() => console.log("View file", doc.id)}
                  className="w-auto! px-6! py-2! font-semibold text-sm md:text-base"
                />

                {doc.status === "Pending" && (
                  <>
                    <Button
                      text="Reject"
                      variant="outline"
                      onClick={() => handleDocumentAction(doc.id, "Reject")}
                      className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                    />
                    <Button
                      text="Approve"
                      variant="outline"
                      onClick={() => handleDocumentAction(doc.id, "Approve")}
                      className="w-auto! px-6! py-2! text-[#29C680]! font-semibold text-sm md:text-base"
                    />
                  </>
                )}

                {doc.status === "Approved" && (
                  <Button
                    text="Approved"
                    variant="outline"
                    className="w-auto! px-6! py-2! text-[#29C680]! font-semibold text-sm md:text-base"
                  />
                )}

                {doc.status === "Rejected" && (
                  <Button
                    text="Rejected"
                    variant="outline"
                    className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewKYCRequest;
