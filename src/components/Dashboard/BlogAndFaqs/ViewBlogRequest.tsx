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
      <div className="mt-6 mb-4 w-full border border-gray-200 rounded-xl p-8 h-[calc(100vh-250px)] overflow-y-auto">
        <div className="mx-auto max-w-2xl">
          {/* Placeholder Image */}
          <div className="w-full h-48 rounded-2xl mb-6 relative overflow-hidden bg-gradient-to-r from-[#D8EAF8] via-[#E0DEF7] to-[#E0F5F8] shrink-0">
            <div className="absolute inset-0">
               {/* Organic mesh gradient background */}
               <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-blue-200/20 blur-3xl rounded-full rotate-12" />
               <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[200%] bg-purple-200/20 blur-3xl rounded-full -rotate-12" />
               
               {/* Main Center Sphere */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#FDF6C9_0%,_#D3CFF6_40%,_#9CB9F6_100%)] shadow-xl z-10" />
               
               {/* Small Top Sphere */}
               <div className="absolute top-10 left-[40%] w-6 h-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#FEF9C3_0%,_#C4B5FD_100%)] shadow-md z-10" />

               {/* Glassmorphism overlay */}
               <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            </div>
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
