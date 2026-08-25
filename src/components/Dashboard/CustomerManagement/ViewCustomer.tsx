"use client";

import React, { useEffect, useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import CustomerInfoTab from "./CustomerInfoTab";
import ConfigurationTab from "./ConfigurationTab";
import DocumentsTab from "./DocumentsTab";
import PaymentsAndCardsTab from "./PaymentsAndCardsTab";
import ActiveProductsTab from "./ActiveProductsTab";
import ActivityLogTab from "./ActivityLogTab";

import { Customer } from "@/types/customer";
import { canManageCustomerConfiguration } from "@/utils/customerAccess";

interface ViewCustomerProps {
  customer: Customer;
  onEdit?: () => void;
  onDeactivate?: () => void;
  onResetPassword?: () => void;
  initialTab?: string;
}

const ViewCustomer: React.FC<ViewCustomerProps> = ({
  customer,
  onEdit,
  onDeactivate,
  onResetPassword,
  initialTab = "Customer Info",
}) => {
  const showConfiguration = canManageCustomerConfiguration(customer.status);
  const resolvedInitialTab =
    initialTab === "Configuration" && !showConfiguration ? "Customer Info" : initialTab;
  const [activeTab, setActiveTab] = useState(resolvedInitialTab);

  useEffect(() => {
    if (!showConfiguration && activeTab === "Configuration") {
      setActiveTab("Customer Info");
    }
  }, [showConfiguration, activeTab]);

  const tabs = [
    "Customer Info",
    "Active Products",
    "Payments",
    "Documents",
    "Activity Log",
    ...(showConfiguration ? ["Configuration"] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Customer Info" ? (
        <CustomerInfoTab
          customer={customer}
          onEdit={onEdit}
          onDeactivate={showConfiguration ? onDeactivate : undefined}
        />
      ) : activeTab === "Active Products" ? (
        <ActiveProductsTab assignments={customer.productAssignments} />
      ) : activeTab === "Configuration" && showConfiguration ? (
        <ConfigurationTab
          onDeactivate={onDeactivate}
          onResetPassword={onResetPassword}
        />
      ) : activeTab === "Documents" ? (
        <DocumentsTab customerId={customer.id} />
      ) : activeTab === "Payments" ? (
        <PaymentsAndCardsTab customerId={customer.id} />
      ) : activeTab === "Activity Log" ? (
        <ActivityLogTab customerId={customer.id} />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Unable to display the selected customer tab.
        </div>
      )}
    </div>
  );
};

export default ViewCustomer;
