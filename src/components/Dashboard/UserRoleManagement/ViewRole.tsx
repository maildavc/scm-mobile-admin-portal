"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import RoleInfoTab from "./tabs/RoleInfoTab";
import RoleConfigurationTab from "./tabs/RoleConfigurationTab";
import DeactivateRoleModal from "./DeactivateRoleModal";

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
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = (newRoleId: string) => {
    console.log("Reassigning users to role:", newRoleId);
    onDeactivate(role);
    setShowDeactivateModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Deactivate Role Modal */}
      <DeactivateRoleModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onDeactivate={handleDeactivateConfirm}
        roleName={role.name}
      />

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
            onDeactivate={handleDeactivateClick}
          />
        ) : (
          <RoleConfigurationTab onDeactivate={handleDeactivateClick} />
        )}
      </div>
    </div>
  );
};

export default ViewRole;
