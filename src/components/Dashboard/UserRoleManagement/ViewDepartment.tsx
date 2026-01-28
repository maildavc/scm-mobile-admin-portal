"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import DepartmentInfoTab from "./tabs/DepartmentInfoTab";
import DepartmentConfigurationTab from "./tabs/DepartmentConfigurationTab";
import DeactivateDepartmentModal from "./DeactivateDepartmentModal";

interface ViewDepartmentProps {
  department: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  };
  onEdit: (department: ViewDepartmentProps["department"]) => void;
  onDeactivate: (department: ViewDepartmentProps["department"]) => void;
}

const ViewDepartment: React.FC<ViewDepartmentProps> = ({
  department,
  onEdit,
  onDeactivate,
}) => {
  const [activeTab, setActiveTab] = useState("User Info");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = (newDepartmentId: string) => {
    console.log("Reassigning users to department:", newDepartmentId);
    onDeactivate(department);
    setShowDeactivateModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Deactivate Department Modal */}
      <DeactivateDepartmentModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onDeactivate={handleDeactivateConfirm}
        departmentName={department.name}
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
          <DepartmentInfoTab
            department={department}
            onEdit={() => onEdit(department)}
            onDeactivate={handleDeactivateClick}
          />
        ) : (
          <DepartmentConfigurationTab onDeactivate={handleDeactivateClick} />
        )}
      </div>
    </div>
  );
};

export default ViewDepartment;
