"use client";

import React, { useState } from "react";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";

interface ApproveRoleRequestProps {
  role: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onBack: () => void;
  onApprove?: (role: ApproveRoleRequestProps["role"]) => void;
  onReject?: (role: ApproveRoleRequestProps["role"], reason: string) => void;
}

const ApproveRoleRequest: React.FC<ApproveRoleRequestProps> = ({
  role,
  onBack,
  onApprove,
  onReject,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  const roleInfo = [
    { label: "Role Name", value: role.name },
    { label: "Role Description", value: role.description },
  ];

  const assignedPermissions = [
    {
      module: "Product Offering",
      permissions: ["Create Product", "Approve Product"],
    },
    {
      module: "Customer management",
      permissions: ["Create Customer", "Approve Customer"],
    },
    {
      module: "User & Role management",
      permissions: [
        "Create User",
        "Approve User",
        "Create Role",
        "Approve Role",
      ],
    },
    {
      module: "Audit Log",
      permissions: ["View Logs", "Export Logs"],
    },
    {
      module: "KYC Verification",
      permissions: ["Regularise KYC", "Approve KYC"],
    },
    {
      module: "Integration",
      permissions: ["Create and Approve Integration"],
    },
    {
      module: "Customer Service",
      permissions: ["View Requests", "Manage request"],
    },
  ];

  const handleApprove = () => {
    onApprove?.(role);
    setShowApproveModal(false);
    setShowApproveSuccess(true);
  };

  const handleReject = (reason: string) => {
    onReject?.(role, reason);
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
          Role Creation Request Approved
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Role creation was successfully approved.
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
          Role Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Role request was successfully rejected.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Role Information */}
          <DetailCard title="Role Information">
            {roleInfo.map((info, index) => (
              <DetailRow key={index} label={info.label} value={info.value} />
            ))}
          </DetailCard>

          {/* Right Column: Assigned Permissions */}
          <DetailCard title="Assigned Permissions">
            {assignedPermissions.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index !== assignedPermissions.length - 1
                    ? "border-b border-[#F4F4F5]"
                    : ""
                }`}
              >
                <div className="text-sm text-[#2F3140] w-1/2">
                  {item.module}
                </div>
                <div className="space-y-1 text-right w-1/2">
                  {item.permissions.map((permission, pIndex) => (
                    <div
                      key={pIndex}
                      className="text-sm text-[#707781] font-semibold"
                    >
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
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

export default ApproveRoleRequest;
