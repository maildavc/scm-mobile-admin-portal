"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import CreateCustomerForm from "@/components/Dashboard/CustomerManagement/CreateCustomerForm";
import ViewCustomer from "@/components/Dashboard/CustomerManagement/ViewCustomer";
import {
  CUSTOMER_MANAGEMENT_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/customerManagement/customerManagement";
import ActionButton from "@/components/Dashboard/ActionButton";
import { createCustomerColumns } from "./columns";
import { useAuthStore } from "@/stores/authStore";
import ViewCustomerRequest from "@/components/Dashboard/CustomerManagement/ViewCustomerRequest";
import { Customer } from "@/types/customer";
import {
  useGetCustomers,
  useDeactivateCustomer,
  useResendCustomerEmailVerification,
  useResetCustomerPassword,
} from "@/hooks/useCustomers";
import { useToastStore } from "@/stores/toastStore";

const normalizeStatus = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

const getCustomerTimestamp = (customer: Customer) => {
  const raw = customer.updatedAt || customer.createdAt || "";
  const time = Date.parse(raw);
  return Number.isNaN(time) ? 0 : time;
};

const sortCustomersNewestFirst = (customers: Customer[]) =>
  [...customers].sort((a, b) => getCustomerTimestamp(b) - getCustomerTimestamp(a));

export default function CustomerManagement() {
  const [currentView, setCurrentView] = useState("Overview");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [viewInitialTab, setViewInitialTab] = useState("Customer Info");
  const isApprover = useAuthStore((s) => s.isApprover);
  const addToast = useToastStore((s) => s.addToast);
  const deactivateCustomer = useDeactivateCustomer();
  const resendEmail = useResendCustomerEmailVerification();
  const resetPassword = useResetCustomerPassword();

  // Load the full customer list so table pagination (10/20/…) works over every record.
  // The table itself handles page size / page number client-side.
  const { data: customersData, isLoading } = useGetCustomers({
    page: 1,
    limit: 1000,
  });

  const customers = sortCustomersNewestFirst(customersData?.data || []);
  const customerCount = customersData?.totalCount ?? customers.length;

  // Sidebar Logic
  const allSidebarItems = CUSTOMER_MANAGEMENT_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: viewCustomer ? item.label === "Overview" : item.label === currentView,
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
    setViewInitialTab("Customer Info");
    setCurrentView(customer.name);
  };

  const handleConfigureCustomer = (customer: Customer) => {
    setViewCustomer(customer);
    setEditCustomer(null);
    setViewInitialTab("Configuration");
    setCurrentView(customer.name);
  };

  const resetView = () => {
    setCurrentView("Overview");
    setEditCustomer(null);
    setViewCustomer(null);
    setViewInitialTab("Customer Info");
  };

  const handleDeactivateCustomer = async (customer: Customer) => {
    try {
      await deactivateCustomer.mutateAsync({
        customerId: customer.id,
        reason: "Deactivated by admin",
      });
      addToast("Customer deactivated successfully", "success");
      resetView();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        "Failed to deactivate customer";
      addToast(message, "error");
    }
  };

  const handleResendEmail = async (customer: Customer) => {
    try {
      await resendEmail.mutateAsync(customer.id);
      addToast("Customer email reset initiated successfully", "success");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        "Failed to reset customer email";
      addToast(message, "error");
      throw error;
    }
  };

  const handleResetPassword = async (customer: Customer) => {
    try {
      await resetPassword.mutateAsync(customer.id);
      addToast("Customer password reset initiated successfully", "success");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        "Failed to reset customer password";
      addToast(message, "error");
      throw error;
    }
  };

  const columns = createCustomerColumns(
    handleEditCustomer,
    handleViewCustomer,
    handleDeactivateCustomer,
    isApprover,
    handleConfigureCustomer,
    customerCount,
  );

  const breadcrumbs = getBreadcrumbs(viewCustomer ? viewCustomer.name : currentView).map(
    (crumb) => {
      if (crumb.label === "Customer Management") {
        return { ...crumb, onClick: resetView, href: undefined };
      }
      return crumb;
    },
  );

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
                  {STATS_CONFIG.map((stat) => {
                    let value = "0";
                    if (customers.length > 0) {
                      if (stat.label === "Active Customers") {
                        value = customers
                          .filter((c) => normalizeStatus(c.status) === "active")
                          .length.toString();
                      } else if (stat.label === "Inactive Customers") {
                        value = customers
                          .filter((c) =>
                            ["inactive", "deactivated"].includes(normalizeStatus(c.status)),
                          )
                          .length.toString();
                      } else if (stat.label === "Customers with Pending KYC") {
                        value = customers
                          .filter((c) => {
                            const kyc = normalizeStatus(c.kycStatus);
                            // API often omits kycStatus; table treats that as Pending.
                            return !kyc || ["pending", "awaitingapproval"].includes(kyc);
                          })
                          .length.toString();
                      }
                    }

                    return <StatsCard key={stat.label} label={stat.label} value={value} />;
                  })}
                </div>

                <div className="flex justify-between items-center gap-3 mb-6">
                  <ActionButton label="Download Table as PDF" actionText="Download" fullWidth />
                  <ActionButton label="Export Table as CSV" actionText="Export" fullWidth />
                </div>

                <Table
                  data={customers}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  isLoading={isLoading}
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
              (() => {
                const status = String(viewCustomer.status || "").toLowerCase();
                const needsApproval =
                  status === "pending" ||
                  status === "awaiting approval" ||
                  status === "awaitingapproval";
                // Approvers review pending requests; Configuration (email/password reset)
                // is on ViewCustomer for already-approved customers.
                const showApprovalView = isApprover && needsApproval;

                return showApprovalView ? (
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
                    key={`${viewCustomer.id}-${viewInitialTab}`}
                    customer={viewCustomer}
                    initialTab={viewInitialTab}
                    onEdit={() => handleEditCustomer(viewCustomer)}
                    onDeactivate={() => handleDeactivateCustomer(viewCustomer)}
                    onResendEmail={() => handleResendEmail(viewCustomer)}
                    onResetPassword={() => handleResetPassword(viewCustomer)}
                  />
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Unable to display the selected customer view.
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
