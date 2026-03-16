import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import BlogNFaqContent from "./BlogNFaqContent";

import { useFAQDetails, useFAQAction } from "@/hooks/useFaq";
import { FAQDto, FAQStatus } from "@/types/faq";

interface ViewFAQRequestProps {
  faq: FAQDto;
  isApprover?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const ViewFAQRequest: React.FC<ViewFAQRequestProps> = ({
  faq,
  isApprover = false,
  onApprove,
  onReject,
}) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState<
    "review" | "success" | "rejected"
  >("review");

  const { data: detailData, isLoading } = useFAQDetails(faq.id);
  const approveAction = useFAQAction("approve");
  const rejectAction = useFAQAction("reject");

  const fullFaq = detailData;

  const handleApproveConfirm = () => {
    setIsApproveModalOpen(false);
    approveAction.mutate(
      { id: faq.id, action: "approve" },
      { onSuccess: () => setViewStatus("success") }
    );
  };

  const handleRejectConfirm = () => {
    setIsRejectModalOpen(false);
    rejectAction.mutate(
      { id: faq.id, action: "reject" },
      { onSuccess: () => setViewStatus("rejected") }
    );
  };

  if (viewStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          FAQ Creation Request Approved
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          FAQ creation was successfully approved.
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
          FAQ Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          FAQ creation was successfully rejected.
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
    <div className="flex flex-col h-full">
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApproveConfirm}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleRejectConfirm}
      />

      {/* Creator Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
          <BiUser size={20} />
        </div>
        <div>
          <p className="text-[10px] text-[#707781] font-semibold">Created By</p>
          <p className="text-sm font-bold text-[#2F3140]">{faq.authorName || faq.createdBy || "System"}</p>
          <p className="text-xs text-[#707781]">{new Date(faq.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-500">Loading FAQ details...</div>
      ) : (
        <>
          {/* FAQ Details Card */}
          <DetailCard title="FAQ Details">
            <DetailRow label="Question" value={fullFaq?.question || faq.question || "-"} />
            <DetailRow label="Category" value={fullFaq?.categoryName || "General"} />
            <DetailRow label="Schedule" value={fullFaq?.whenShouldItGoLive || faq.whenShouldItGoLive || "-"} />
            <DetailRow label="Status" value={fullFaq?.statusName || FAQStatus[Number(faq.status) as unknown as keyof typeof FAQStatus] || String(faq.status)} />
          </DetailCard>

          {/* FAQ Answer */}
          <BlogNFaqContent
            heading={fullFaq?.question || faq.question || "No Question"}
            paragraph1={fullFaq?.answer || faq.answer || "No answer provided."}
            subheading=""
            paragraph2=""
            showImage={false}
          />
        </>
      )}

      {isApprover && (
        <div className="mt-auto pt-6 flex justify-end gap-3 border-t border-transparent">
          <div className="w-32">
            <Button
              text="Reject Request"
              variant="outline"
              onClick={() => setIsRejectModalOpen(true)}
              className="text-[#B2171E]! text-xs md:text-sm"
              disabled={approveAction.isPending || rejectAction.isPending}
            />
          </div>
          <div className="w-40">
            <Button
              text="Approve Request"
              variant="primary"
              onClick={() => setIsApproveModalOpen(true)}
              className="text-xs md:text-sm"
              disabled={approveAction.isPending || rejectAction.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFAQRequest;
