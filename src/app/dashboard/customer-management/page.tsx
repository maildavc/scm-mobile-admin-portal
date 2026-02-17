"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import CreateCustomerForm from "@/components/Dashboard/CustomerManagement/CreateCustomerForm";
import ViewCustomer from "@/components/Dashboard/CustomerManagement/ViewCustomer";
import {
  CUSTOMERS,
  CUSTOMER_MANAGEMENT_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/customerManagement/customerManagement";
import ActionButton from "@/components/Dashboard/ActionButton";
import { createCustomerColumns } from "./columns";
import { useAuthStore } from "@/stores/authStore";
import ViewCustomerRequest from "@/components/Dashboard/CustomerManagement/ViewCustomerRequest";

type Customer = {
  id: string;
  name: string;
  tier: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  kycStatus: "Awaiting Approval" | "Completed";
  updated: string;
  requestType?: string;
};

export default function CustomerManagement() {
  const [currentView, setCurrentView] = useState("Overview");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const isApprover = useAuthStore((s) => s.isApprover);

  // Sidebar Logic
  const allSidebarItems = CUSTOMER_MANAGEMENT_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: viewCustomer
      ? item.label === "Overview"
      : item.label === currentView,
  }));

  const sidebarItems = isApprover
    ? allSidebarItems.filter((item) => item.label === "Overview")
    : allSidebarItems;

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setEditCustomer(null);
    setViewCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditCustomer(customer);
    setViewCustomer(null);
    setCurrentView("Create Customer");
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewCustomer(customer);
    setEditCustomer(null);
    setCurrentView(customer.name);
  };

  const columns = createCustomerColumns(
    handleEditCustomer,
    handleViewCustomer,
    isApprover,
  );

  const resetView = () => {
    setCurrentView("Overview");
    setEditCustomer(null);
    setViewCustomer(null);
  };

  const breadcrumbs = getBreadcrumbs(
    viewCustomer ? viewCustomer.name : currentView,
  ).map((crumb) => {
    if (crumb.label === "Customer Management") {
      return { ...crumb, onClick: resetView, href: undefined };
    }
    return crumb;
  });

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar menuItems={sidebarItems} onItemClick={handleSidebarClick} />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {STATS_CONFIG.map((stat) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center gap-3 mb-6">
                  <ActionButton
                    onClick={() => console.log("Download clicked")}
                    label="Download Table as PDF"
                    actionText="Download"
                    fullWidth
                  />
                  <ActionButton
                    onClick={() => console.log("Export clicked")}
                    label="Export Table as CSV"
                    actionText="Export"
                    fullWidth
                  />
                </div>

                <Table
                  data={CUSTOMERS}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                />
              </>
            ) : currentView === "Create Customer" ? (
              <CreateCustomerForm
                initialData={editCustomer}
                onSuccess={() => {
                  setCurrentView("Overview");
                  setEditCustomer(null);
                }}
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditCustomer(null);
                }}
              />
            ) : viewCustomer ? (
              isApprover ? (
                <ViewCustomerRequest
                  customer={viewCustomer}
                  onApprove={() => {
                    setCurrentView("Overview");
                    setViewCustomer(null);
                  }}
                  onReject={() => {
                    setCurrentView("Overview");
                    setViewCustomer(null);
                  }}
                />
              ) : (
                <ViewCustomer
                  customer={viewCustomer}
                  onEdit={() => handleEditCustomer(viewCustomer)}
                  onDeactivate={() => {
                    // Handle deactivation
                    setCurrentView("Overview");
                    setViewCustomer(null);
                  }}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {currentView} view coming soon
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
