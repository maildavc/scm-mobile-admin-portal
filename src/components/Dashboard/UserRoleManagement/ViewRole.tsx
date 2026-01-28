"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import RoleInfoTab from "./tabs/RoleInfoTab";

interface ViewRoleProps {
  role: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onBack: () => void;
  onEdit: (role: ViewRoleProps["role"]) => void;
  onDeactivate: (role: ViewRoleProps["role"]) => void;
}

const ViewRole: React.FC<ViewRoleProps> = ({
  role,
  onBack,
  onEdit,
  onDeactivate,
}) => {
  const [activeTab, setActiveTab] = useState("User Info");

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with Tabs */}
      <div className="mb-6">
        <Tabs
          tabs={["User Info", "Configuration"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "User Info" ? (
          <RoleInfoTab
            role={role}
            onEdit={() => onEdit(role)}
            onDeactivate={() => onDeactivate(role)}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Configuration tab coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRole;
