import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";

type Customer = {
  id: string;
  name: string;
  tier: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  kycStatus: "Awaiting Approval" | "Completed";
  updated: string;
  requestType?: string;
};

interface ViewCustomerRequestProps {
  customer: Customer;
  onApprove: () => void;
  onReject: () => void;
}

const CUSTOMER_INFO = [
  { label: "Customers name", value: "Aremu Victoria Babatunde" },
  { label: "Gender", value: "Male" },
  { label: "Date of Birth", value: "DD/MM/YYYY" },
  { label: "Citizenship", value: "Nigerian" },
  { label: "Email", value: "aremuvictoria@gmail.com" },
  { label: "Phone Number", value: "0900 000 0000" },
];

const PROFILE_INFO = [
  { label: "Account Tier", value: "User & Role Management" },
  { label: "BVN", value: "00000000098" },
  { label: "NIN", value: "00000000098" },
  { label: "Bank Account", value: "000098765678 - Stanbic IBTC PLC" },
  {
    label: "Address",
    value: "25 Idemejo Estate, Trinity Avenue, Idemejo, Victoria Island, Lagos",
  },
  { label: "Next of Kin", value: "Juanita (Sister)" },
  { label: "Next of Kin Phone", value: "08000000909" },
];

const DetailRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <div
    className={`flex justify-between items-start py-2 ${
      !isLast ? "border-b border-[#F4F4F5]" : ""
    }`}
  >
    <span className="text-sm text-[#2F3140]">{label}</span>
    <span className="text-sm text-[#707781] font-medium text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

const ViewCustomerRequest: React.FC<ViewCustomerRequestProps> = ({
  customer,
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
          Customer Creation Request Approved Successfully
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Customer creation request was successfully approved.
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
          Customer Creation Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Customer creation request was successfully rejected.
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
        title="Approve Customer?"
        description="Are you sure you want to approve this customer?"
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleRejectConfirm}
        title="Reject Customer?"
        description="Are you sure you want to reject this customer?"
      />

      {/* Creator Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
          <BiUser size={20} />
        </div>
        <div>
          <p className="text-[10px] text-[#707781] font-semibold">Created By</p>
          <p className="text-sm font-bold text-[#2F3140]">Adeyemi Opeyemi</p>
          <p className="text-xs text-[#707781]">January 12, 2026 13:23</p>
        </div>
      </div>

      {/* Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Customer Information */}
        <div className="border rounded-xl p-6 border-[#F4F4F5]">
          <h3 className="text-sm font-semibold text-[#2F3140] mb-6">
            Customer Information
          </h3>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#2F3140] flex items-center justify-center text-white">
              <BiUser size={48} />
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            {CUSTOMER_INFO.map((info) => (
              <DetailRow
                key={info.label}
                label={info.label}
                value={info.value}
                isLast={false}
              />
            ))}
            <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
              <span className="text-sm text-[#2F3140]">Account Status</span>
              <StatusBadge status={customer.status} />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#2F3140]">KYC Status</span>
              <StatusBadge status={customer.kycStatus} />
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="border rounded-xl p-6 border-[#F4F4F5]">
          <h3 className="text-sm font-semibold text-[#2F3140] mb-6">
            Profile Information
          </h3>
          <div className="space-y-4">
            {PROFILE_INFO.map((info, index) => (
              <DetailRow
                key={info.label}
                label={info.label}
                value={info.value}
                isLast={index === PROFILE_INFO.length - 1}
              />
            ))}
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

export default ViewCustomerRequest;
