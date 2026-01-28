"use client";

import React, { useState } from "react";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";

interface ApproveDepartmentRequestProps {
  department: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onBack: () => void;
  onApprove?: (department: ApproveDepartmentRequestProps["department"]) => void;
  onReject?: (
    department: ApproveDepartmentRequestProps["department"],
    reason: string,
  ) => void;
}

const ApproveDepartmentRequest: React.FC<ApproveDepartmentRequestProps> = ({
  department,
  onBack,
  onApprove,
  onReject,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  const departmentInfo = [
    { label: "Department Name", value: department.name },
    { label: "Department Description", value: department.description },
  ];

  const handleApprove = () => {
    onApprove?.(department);
    setShowApproveModal(false);
    setShowApproveSuccess(true);
  };

  const handleReject = (reason: string) => {
    onReject?.(department, reason);
    setShowRejectModal(false);
    setShowRejectSuccess(true);
  };

  const handleDone = () => {
    setShowApproveSuccess(false);
    setShowRejectSuccess(false);
    onBack();
  };

  // Approve Success Screen
  if (showApproveSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Department Creation Request Approved
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Department creation was successfully approved.
        </p>
        <div className="w-32">
          <Button text="Done" variant="primary" onClick={handleDone} />
        </div>
      </div>
    );
  }

  // Reject Success Screen
  if (showRejectSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Department Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Department request was successfully rejected.
        </p>
        <div className="w-32">
          <Button text="Done" variant="primary" onClick={handleDone} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Approve Modal */}
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(80vh-200px)]">
          {/* Department Information */}
          <DetailCard title="Department Information">
            {departmentInfo.map((info, index) => (
              <DetailRow key={index} label={info.label} value={info.value} />
            ))}
          </DetailCard>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6">
          <div className="w-40">
            <Button
              text="Reject Request"
              variant="outline"
              onClick={() => setShowRejectModal(true)}
            />
          </div>
          <div className="w-48">
            <Button
              text="Approve Request"
              variant="primary"
              onClick={() => setShowApproveModal(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveDepartmentRequest;
