import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import {
  BLOG_DETAILS,
  BLOG_CONTENT,
} from "@/constants/blogAndFaqs/blogDetails";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";

type BlogPost = {
  id: string;
  title: string;
  description: string;
  author: string;
  audience: string;
  dateCreated: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  approverStatus: "Approved" | "Awaiting Approval";
  image: string;
};

interface ViewBlogRequestProps {
  blogPost: BlogPost;
  onApprove: () => void;
  onReject: () => void;
}

const ViewBlogRequest: React.FC<ViewBlogRequestProps> = ({
  blogPost,
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
          Blog Creation Request Approved
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Blog creation was successfully approved.
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
          Blog Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Blog creation was successfully rejected.
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

      {/* Blog Details Card */}
      <DetailCard title="Blog Details">
        {BLOG_DETAILS.map((detail) => (
          <DetailRow
            key={detail.label}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </DetailCard>

      {/* Blog Content */}
      <div className="mt-8 mb-8">
        {/* Placeholder Image */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-200 via-purple-300 to-teal-200 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 via-purple-400/50 to-teal-300/50 backdrop-blur-sm" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 via-purple-300 to-blue-400" />
        </div>

        {/* Content Text */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#2F3140] text-base">
            {BLOG_CONTENT.heading}
          </h3>
          <p className="text-sm text-[#707781] leading-relaxed">
            {BLOG_CONTENT.paragraph1}
          </p>

          <h4 className="font-bold text-[#2F3140] text-sm pt-2">
            {BLOG_CONTENT.subheading}
          </h4>
          <p className="text-sm text-[#707781] leading-relaxed">
            {BLOG_CONTENT.paragraph2}
          </p>
        </div>
      </div>

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

export default ViewBlogRequest;
