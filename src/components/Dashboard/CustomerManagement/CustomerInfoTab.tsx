import React from "react";
import Button from "@/components/Button";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { BiUser } from "react-icons/bi";

interface CustomerInfoTabProps {
  customer: {
    name: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    kycStatus: "Awaiting Approval" | "Completed";
  };
  onEdit?: () => void;
  onDeactivate?: () => void;
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

const CustomerInfoTab: React.FC<CustomerInfoTabProps> = ({
  customer,
  onEdit,
  onDeactivate,
}) => {
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

          {/* Customer Info */}
          <div className="space-y-4">
            {CUSTOMER_INFO.map((info, index) => (
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
              <span className="text-sm text-[##2F3140]">KYC Status</span>
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
