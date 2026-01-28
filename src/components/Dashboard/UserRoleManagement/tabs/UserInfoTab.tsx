"use client";

import React from "react";
import { FiUser } from "react-icons/fi";
import { DetailCard, DetailRow } from "../../SharedDetails";
import { StatusBadge } from "../../StatusBadge";
import Button from "@/components/Button";

interface UserInfoTabProps {
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
  onEdit?: (user: any) => void;
  onDeactivate?: (user: any) => void;
}

const UserInfoTab: React.FC<UserInfoTabProps> = ({
  user,
  onEdit,
  onDeactivate,
}) => {
  const userInfo = [
    { label: "Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phone || "0900 000 0000" },
    { label: "Department", value: user.department || "Legal" },
    { label: "Role", value: user.roleName },
    { label: "Role Type", value: user.roleType },
    { label: "Account Status", value: <StatusBadge status={user.status} /> },
  ];

  const permissions = [
    { label: "Create New Role", value: "User & Role Management" },
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailCard
          title="User Information"
          headerContent={
            <div className="w-28 h-28 bg-[#2F3140] rounded-full flex items-center justify-center text-white">
              <FiUser size={48} />
            </div>
          }
        >
          {userInfo.map((row, idx) => (
            <DetailRow key={idx} label={row.label} value={row.value} />
          ))}
        </DetailCard>

        <DetailCard title="User Permissions">
          {permissions.map((row, idx) => (
            <DetailRow key={idx} label={row.label} value={row.value} />
          ))}
        </DetailCard>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6">
        <div className="w-48">
          <Button
            text="Deactivate User"
            variant="outline"
            onClick={() => onDeactivate?.(user)}
            className="text-xs lg:text-sm"
          />
        </div>
        <div className="w-48">
          <Button
            text="Edit User Info & Role"
            variant="primary"
            onClick={() => onEdit?.(user)}
            className="text-xs lg:text-sm"
          />
        </div>
      </div>
    </>
  );
};

export default UserInfoTab;
