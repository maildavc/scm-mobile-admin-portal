"use client";

import React, { useState } from "react";
import CustomerInfoTab from "./CustomerInfoTab";
import ConfigurationTab from "./ConfigurationTab";
import DocumentsTab from "./DocumentsTab";
import PaymentsAndCardsTab from "./PaymentsAndCardsTab";
import ActiveProductsTab from "./ActiveProductsTab";

type Customer = {
  id: string;
  name: string;
  tier: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  kycStatus: "Awaiting Approval" | "Completed";
  updated: string;
};

interface ViewCustomerProps {
  customer: Customer;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

const ViewCustomer: React.FC<ViewCustomerProps> = ({ customer, onEdit, onDeactivate }) => {
  const [activeTab, setActiveTab] = useState("Customer Info");

  const tabs = [
    "Customer Info",
    "Active Products",
    "Payments & Cards",
    "Documents",
    "Activity Log",
    "Configuration"
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-colors cursor-pointer border whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#FDE4E5] text-[#B2171E] border-[#FFC6C5]"
                : "bg-white text-[#2F3140] border-[#7077813D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Customer Info" ? (
        <CustomerInfoTab 
          customer={customer}
          onEdit={onEdit} 
          onDeactivate={onDeactivate}
        />
      ) : activeTab === "Active Products" ? (
        <ActiveProductsTab />
      ) : activeTab === "Configuration" ? (
        <ConfigurationTab onDeactivate={onDeactivate} />
      ) : activeTab === "Documents" ? (
        <DocumentsTab />
      ) : activeTab === "Payments & Cards" ? (
        <PaymentsAndCardsTab />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          {activeTab} view coming soon
        </div>
      )}
    </div>
  );
};

export default ViewCustomer;
