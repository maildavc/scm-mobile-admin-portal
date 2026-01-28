"use client";

import React from "react";
import {
  DetailCard,
  DetailRow,
  DetailSubheading,
} from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";

interface RoleInfoTabProps {
  role: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onEdit: () => void;
  onDeactivate: () => void;
}

const RoleInfoTab: React.FC<RoleInfoTabProps> = ({
  role,
  onEdit,
  onDeactivate,
}) => {
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

  const assignedUsers = [
    { name: "Aremu Babalola", department: "Department name of user" },
    { name: "Name of assigned user", department: "Department name of user" },
    { name: "Name of assigned user", department: "Department name of user" },
    { name: "Name of assigned user", department: "Department name of user" },
    { name: "Name of assigned user", department: "Department name of user" },
    { name: "Name of assigned user", department: "Department name of user" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Role Information with Assigned Permissions */}
          <DetailCard title="Role Information">
            {/* Role Info Rows */}
            {roleInfo.map((info, index) => (
              <DetailRow key={index} label={info.label} value={info.value} />
            ))}

            {/* Assigned Permissions Subheading */}
            <DetailSubheading title="Assigned Permissions" />

            {/* Assigned Permissions List */}
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

          {/* Right Column: Assigned Users */}
          <DetailCard title="Assigned Users">
            {assignedUsers.map((user, index) => (
              <DetailRow
                key={index}
                label={user.name}
                value={user.department}
              />
            ))}
          </DetailCard>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <div className="w-48">
            <Button
              text="Deactivate User"
              variant="outline"
              onClick={onDeactivate}
              className="text-xs lg:text-sm"
            />
          </div>
          <div className="w-48">
            <Button
              text="Edit User Info & Role"
              variant="primary"
              onClick={onEdit}
              className="text-xs lg:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoTab;
