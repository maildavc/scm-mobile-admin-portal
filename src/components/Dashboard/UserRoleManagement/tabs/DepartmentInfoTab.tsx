"use client";

import React from "react";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";

interface DepartmentInfoTabProps {
  department: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onEdit: () => void;
  onDeactivate: () => void;
}

const DepartmentInfoTab: React.FC<DepartmentInfoTabProps> = ({
  department,
  onEdit,
  onDeactivate,
}) => {
  const departmentInfo = [
    { label: "Department Name", value: department.name },
    { label: "Department Description", value: department.description },
  ];

  const assignedUsers = [
    { name: "Aremu Babalola", role: "Role name of user" },
    { name: "Name of assigned user", role: "Role name of user" },
    { name: "Name of assigned user", role: "Role name of user" },
    { name: "Name of assigned user", role: "Role name of user" },
    { name: "Name of assigned user", role: "Role name of user" },
    { name: "Name of assigned user", role: "Role name of user" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Information */}
          <DetailCard title="Department Information">
            {departmentInfo.map((info, index) => (
              <DetailRow key={index} label={info.label} value={info.value} />
            ))}
          </DetailCard>

          {/* Assigned Users */}
          <DetailCard title="Assigned Users">
            {assignedUsers.map((user, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index !== assignedUsers.length - 1
                    ? "border-b border-[#F4F4F5]"
                    : ""
                }`}
              >
                <div className="text-sm text-[#2F3140]">{user.name}</div>
                <div className="text-sm text-[#707781] font-semibold">
                  {user.role}
                </div>
              </div>
            ))}
          </DetailCard>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6">
          <div className="w-40">
            <Button
              text="Deactivate User"
              variant="outline"
              onClick={onDeactivate}
            />
          </div>
          <div className="w-56">
            <Button
              text="Edit User Info & Role"
              variant="primary"
              onClick={onEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentInfoTab;
