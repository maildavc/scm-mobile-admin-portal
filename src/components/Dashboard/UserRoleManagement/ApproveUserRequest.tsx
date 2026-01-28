"use client";

import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";

interface ApproveUserRequestProps {
  user: {
    id: string;
    name: string;
    email: string;
    roleName: string;
    roleType: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    phone?: string;
    department?: string;
  };
  onBack: () => void;
  onApprove?: (user: ApproveUserRequestProps["user"]) => void;
  onReject?: (user: ApproveUserRequestProps["user"], reason: string) => void;
}

const ApproveUserRequest: React.FC<ApproveUserRequestProps> = ({
  user,
  onBack,
  onApprove,
  onReject,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  const userInfo = [
    { label: "Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phone || "0900 000 0000" },
    { label: "Department", value: user.department || "Legal" },
    { label: "Role", value: user.roleName },
    { label: "Role Type", value: user.roleType },
  ];

  const permissions = [
    {
      label: "Create New Role",
      value: "User & Role Management",
    },
    {
      label: "Name of permission here",
      value: "Module the permission comes from",
    },
    {
      label: "Name of permission here",
      value: "Module the permission comes from",
    },
    {
      label: "Name of permission here",
      value: "Module the permission comes from",
    },
    {
      label: "Name of permission here",
      value: "Module the permission comes from",
    },
    {
      label: "Name of permission here",
      value: "Module the permission comes from",
    },
  ];

  const handleApprove = () => {
    onApprove?.(user);
    setShowApproveModal(false);
    setShowApproveSuccess(true);
  };

  const handleReject = (reason: string) => {
    onReject?.(user, reason);
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
          User Creation Request Approved
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          User creation was successfully approved.
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
          User Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          User request was successfully rejected.
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
          <DetailCard
            title="User Information"
            headerContent={
              <div className="w-40 h-40 bg-[#2F3140] rounded-full flex items-center justify-center text-white">
                <FiUser size={80} />
              </div>
            }
          >
            {userInfo.map((info, index) => (
              <DetailRow key={index} label={info.label} value={info.value} />
            ))}
          </DetailCard>

          <DetailCard title="User Permissions">
            {permissions.map((permission, index) => (
              <DetailRow
                key={index}
                label={permission.label}
                value={permission.value}
              />
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

export default ApproveUserRequest;
