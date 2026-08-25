"use client";

import React from "react";
import Button from "@/components/Button";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import { BiUser } from "react-icons/bi";
import { Customer } from "@/types/customer";
import { formatDateDdMmYyyy, formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";

interface CustomerInfoTabProps {
  customer: Customer;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

const CustomerInfoTab: React.FC<CustomerInfoTabProps> = ({ customer, onEdit, onDeactivate }) => {
  const customerInfoRows = [
    { label: "Customer Name", value: customer.name || "—" },
    { label: "Email", value: customer.email || "—" },
    { label: "Phone Number", value: customer.phone || "—" },
    { label: "Tier", value: customer.tier || "—" },
    {
      label: "Date Registered",
      value: formatDateTimeDdMmYyyy(customer.createdAt),
    },
    {
      label: "Last Updated",
      value: formatDateTimeDdMmYyyy(customer.updatedAt || customer.createdAt),
    },
  ];

  const profileInfoRows = [
    { label: "First Name", value: customer.firstName || "—" },
    { label: "Middle Name", value: customer.middleName || "—" },
    { label: "Last Name", value: customer.lastName || "—" },
    { label: "Citizenship", value: customer.citizenship || "—" },
    { label: "Gender", value: customer.gender || "—" },
    { label: "Date of Birth", value: formatDateDdMmYyyy(customer.dateOfBirth) },
    { label: "Address", value: customer.address || "—" },
    { label: "City", value: customer.city || "—" },
    { label: "State", value: customer.state || "—" },
    { label: "Country", value: customer.country || "—" },
    { label: "Postal Code", value: customer.postalCode || "—" },
  ];

  return (
    <>
      {/* Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="border rounded-xl p-6 border-[#F4F4F5]">
          <h3 className="text-sm font-semibold text-[#2F3140] mb-6">Customer Information</h3>

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
                displayLabel={!customer.status ? "Awaiting Approval" : undefined}
              />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#2F3140]">KYC Status</span>
              <StatusBadge
                status={(customer.kycStatus || "Inactive") as StatusType}
                displayLabel={customer.kycStatus || "Not Submitted"}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6 border-[#F4F4F5]">
          <h3 className="text-sm font-semibold text-[#2F3140] mb-6">Profile Information</h3>
          <div className="space-y-0">
            {profileInfoRows.map((info, index) => (
              <DetailRow
                key={info.label}
                label={info.label}
                value={info.value}
                isLast={index === profileInfoRows.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6">
        {onDeactivate ? (
          <div className="w-48">
            <Button
              text="Deactivate Customer"
              className="text-xs lg:text-sm"
              variant="outline"
              onClick={onDeactivate}
            />
          </div>
        ) : null}
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
    <span className="text-sm text-[#707781] font-medium text-right max-w-[60%]">{value}</span>
  </div>
);

export default CustomerInfoTab;
