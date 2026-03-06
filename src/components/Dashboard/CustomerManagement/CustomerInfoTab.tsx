"use client";

import React from "react";
import Button from "@/components/Button";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import { BiUser } from "react-icons/bi";
import { Customer } from "@/types/customer";

interface CustomerInfoTabProps {
  customer: Customer;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

const CustomerInfoTab: React.FC<CustomerInfoTabProps> = ({
  customer,
  onEdit,
  onDeactivate,
}) => {
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

  return (
    <>
      {/* Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Customer Info rows */}
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
                status={(customer.status || "Awaiting Approval") as StatusType}
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

        {/* Profile Information — fields not yet returned by API */}
        <div className="border rounded-xl p-6 border-[#F4F4F5]">
          <h3 className="text-sm font-semibold text-[#2F3140] mb-6">
            Profile Information
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#707781]">
            <BiUser size={40} className="mb-3 opacity-30" />
            <p className="text-sm">
              Extended profile details (BVN, NIN, address) are not yet available
              from the backend.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6">
        <div className="w-48">
          <Button
            text="Deactivate Customer"
            className="text-xs lg:text-sm"
            variant="outline"
            onClick={onDeactivate}
          />
        </div>
        <div className="w-48">
          <Button
            className="text-xs lg:text-sm"
            text="Edit Customer Info"
            variant="primary"
            onClick={onEdit}
          />
        </div>
      </div>
    </>
  );
};

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
    className={`flex justify-between items-start py-2 ${!isLast ? "border-b border-[#F4F4F5]" : ""}`}
  >
    <span className="text-sm text-[#2F3140]">{label}</span>
    <span className="text-sm text-[#707781] font-medium text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

export default CustomerInfoTab;
