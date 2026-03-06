import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import Tabs from "@/components/Dashboard/Tabs";
import ActiveProductsTab from "./ActiveProductsTab";
import PaymentsAndCardsTab from "./PaymentsAndCardsTab";
import DocumentsTab from "./DocumentsTab";

import { Customer } from "@/types/customer";
import { useApproveRejectCustomer } from "@/hooks/useCustomers";

interface ViewCustomerRequestProps {
  customer: Customer;
  onApprove: () => void;
  onReject: () => void;
}

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
  const [activeTab, setActiveTab] = useState("Customer Info");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const customerInfoRows = [
    { label: "Customer Name", value: customer.name || "—" },
    { label: "Email", value: customer.email || "—" },
    { label: "Phone Number", value: customer.phone || "—" },
    { label: "Tier", value: customer.tier || "—" },
    {
      label: "Date Registered",
      value: customer.createdAt
        ? new Date(customer.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
    {
      label: "Last Updated",
      value: customer.updatedAt
        ? new Date(customer.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];
  const [viewStatus, setViewStatus] = useState<
    "review" | "success" | "rejected"
  >("review");

  const { mutateAsync: approveRejectCustomer } = useApproveRejectCustomer();

  const handleApproveConfirm = async () => {
    try {
      await approveRejectCustomer({
        customerId: customer.id,
        action: "approve",
      });
      setIsApproveModalOpen(false);
      setViewStatus("success");
    } catch (error) {
      console.error("Failed to approve customer", error);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      // The API doesn't currently take a 'reason' for rejection, but we pass the action
      await approveRejectCustomer({
        customerId: customer.id,
        action: "reject",
      });
      setIsRejectModalOpen(false);
      setViewStatus("rejected");
    } catch (error) {
      console.error("Failed to reject customer", error);
    }
  };

  if (viewStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          {customer.requestType || "Customer Creation"} Request Approved
          Successfully
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          {customer.requestType || "Customer Creation"} request was successfully
          approved.
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
          {customer.requestType || "Customer Creation"} Request Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          {customer.requestType || "Customer Creation"} request was successfully
          rejected.
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
          <p className="text-sm font-bold text-[#2F3140]">{customer.name}</p>
          <p className="text-xs text-[#707781]">
            {customer.createdAt || "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          tabs={["Customer Info", "Active Products", "Cards", "Documents"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "Customer Info" && (
          /* Customer Details Grid */
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
              <div className="space-y-0">
                {customerInfoRows.map((info, index) => (
                  <DetailRow
                    key={info.label}
                    label={info.label}
                    value={info.value}
                    isLast={index === customerInfoRows.length - 1}
                  />
                ))}
                <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
                  <span className="text-sm text-[#2F3140]">Account Status</span>
                  <StatusBadge
                    status={
                      (customer.status || "Awaiting Approval") as StatusType
                    }
                    displayLabel={
                      !customer.status ? "Awaiting Approval" : undefined
                    }
                  />
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[#2F3140]">KYC Status</span>
                  <StatusBadge
                    status={(customer.kycStatus || "Pending") as StatusType}
                    displayLabel={!customer.kycStatus ? "Pending" : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="border rounded-xl p-6 border-[#F4F4F5]">
              <h3 className="text-sm font-semibold text-[#2F3140] mb-6">
                Profile Information
              </h3>
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#707781]">
                <BiUser size={40} className="mb-3 opacity-30" />
                <p className="text-sm">
                  Extended profile details (BVN, NIN, address) are not yet
                  available from the backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Active Products" && (
          <ActiveProductsTab mode="approval" />
        )}
        {activeTab === "Cards" && <PaymentsAndCardsTab mode="approval" />}
        {activeTab === "Documents" && <DocumentsTab mode="approval" />}
      </div>

      {/* Footer Actions */}
      {activeTab !== "Active Products" && (
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
      )}
    </div>
  );
};

export default ViewCustomerRequest;
