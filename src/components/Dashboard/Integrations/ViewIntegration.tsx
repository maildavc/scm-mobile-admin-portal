import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import IntegrationInfoTab from "./IntegrationInfoTab";
import { IntegrationDto } from "@/types/integration";
import APIStatusLogTab from "./APIStatusLogTab";

interface ViewIntegrationProps {
  integration: IntegrationDto;
  onRemove?: () => void;
  onEdit?: () => void;
}

const ViewIntegration: React.FC<ViewIntegrationProps> = ({
  integration,
  onRemove,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState("Integration Info");

  const tabs = ["Integration Info", "API Status Log"];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Integration Info" ? (
        <IntegrationInfoTab
          integration={integration}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ) : activeTab === "API Status Log" ? (
        <APIStatusLogTab integrationId={integration.id} />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          {activeTab} view coming soon
        </div>
      )}
    </div>
  );
};

export default ViewIntegration;
