"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import UserInfoTab from "./tabs/UserInfoTab";
import ActivityLogTab from "./tabs/ActivityLogTab";
import ConfigurationTab from "./tabs/ConfigurationTab";

interface ViewUserProps {
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
  onEdit?: (user: any) => void;
  onDeactivate?: (user: any) => void;
}

const ViewUser: React.FC<ViewUserProps> = ({
  user,
  onBack,
  onEdit,
  onDeactivate,
}) => {
  const [activeTab, setActiveTab] = useState("User Info");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="mb-8">
        <Tabs
          tabs={["User Info", "Activity Log", "Configuration"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "User Info" && (
          <UserInfoTab
            user={user}
            onEdit={onEdit}
            onDeactivate={onDeactivate}
          />
        )}

        {activeTab === "Activity Log" && <ActivityLogTab />}

        {activeTab === "Configuration" && <ConfigurationTab />}
      </div>
    </div>
  );
};

export default ViewUser;
