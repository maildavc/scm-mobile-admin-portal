import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import { FAQ_DETAILS, FAQ_ANSWER } from "@/constants/blogAndFaqs/faqDetails";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import BlogNFaqContent from "./BlogNFaqContent";

type FAQ = {
  id: string;
  title: string;
  description: string;
  author: string;
  dateCreated: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  status: "Active" | "Awaiting Approval";
  approverStatus: "Approved" | "Awaiting Approval";
};

interface ViewFAQRequestProps {
  faq: FAQ;
  onApprove: () => void;
  onReject: () => void;
}

const ViewFAQRequest: React.FC<ViewFAQRequestProps> = ({
  faq,
  onApprove,
  onReject,
}) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState<
    "review" | "success" | "rejected"
  >("review");

  const handleApproveConfirm = () => {
    setIsApproveModalOpen(false);
    setViewStatus("success");
  };

  const handleRejectConfirm = (reason: string) => {
    setIsRejectModalOpen(false);
    console.log("Rejection reason:", reason);
    setViewStatus("rejected");
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
          <p className="text-sm font-bold text-[#2F3140]">Ehizojie Ihayere</p>
          <p className="text-xs text-[#707781]">January 12, 2026 13:23</p>
        </div>
      </div>

      {/* FAQ Details Card */}
      <DetailCard title="FAQ Details">
        {FAQ_DETAILS.map((detail) => (
          <DetailRow
            key={detail.label}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </DetailCard>

      {/* FAQ Answer */}
      <BlogNFaqContent
        heading={FAQ_ANSWER.heading}
        paragraph1={FAQ_ANSWER.paragraph1}
        subheading={FAQ_ANSWER.subheading}
        paragraph2={FAQ_ANSWER.paragraph2}
        showImage={true}
      />

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex justify-end gap-3 border-t border-transparent">
        <div className="w-32">
          <Button
            text="Reject Request"
            variant="outline"
            onClick={() => setIsRejectModalOpen(true)}
            className="text-[#B2171E]! text-xs md:text-sm"
          />
        </div>
        <div className="w-40">
          <Button
            text="Approve Request"
            variant="primary"
            onClick={() => setIsApproveModalOpen(true)}
            className="text-xs md:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewFAQRequest;
