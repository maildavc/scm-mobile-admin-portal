"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import Table from "@/components/Dashboard/Table";
import StatsCard from "@/components/Dashboard/StatsCard";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  KYC_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  MOCK_DATA,
  getBreadcrumbs,
  KYCRequest,
} from "@/constants/kycVerification/kycVerification";
import { createColumns } from "./columns";
import { useRole } from "@/context/RoleContext";
import ViewKYCRequest from "@/components/Dashboard/KYCVerification/ViewKYCRequest";

const KYCVerificationPage = () => {
  const [viewRequest, setViewRequest] = useState<KYCRequest | null>(null);
  const { isApprover } = useRole();

  const handleViewRequest = (request: KYCRequest) => {
    setViewRequest(request);
  };

  const handleBack = () => {
    setViewRequest(null);
  };

  const columns = createColumns(isApprover, handleViewRequest);

  // Create a mutable copy of breadcrumbs with proper type
  const breadcrumbs: {
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }[] = [...getBreadcrumbs()];

  if (viewRequest) {
    const kycCrumbIndex = breadcrumbs.findIndex(
      (b) => b.label === "KYC Verification",
    );
    if (kycCrumbIndex !== -1) {
      // Remove href and add onClick
      breadcrumbs[kycCrumbIndex] = {
        ...breadcrumbs[kycCrumbIndex],
        href: undefined,
        onClick: handleBack,
      };
    }

    breadcrumbs.push({
      label: viewRequest.customer.name,
      active: true,
    });
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={KYC_SIDEBAR_ITEMS}
            onItemClick={(label) => {
              if (label === "Overview") handleBack();
            }}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {viewRequest ? (
              <ViewKYCRequest
                request={viewRequest}
                onApprove={() => setViewRequest(null)}
                onReject={() => setViewRequest(null)}
                onBack={handleBack}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {STATS_CONFIG.map((stat) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      showLink={false}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                  <ActionButton
                    label="Download Table as PDF"
                    actionText="Download"
                    onClick={() => console.log("Download PDF")}
                    fullWidth
                  />
                  <ActionButton
                    label="Export Table as CSV"
                    actionText="Export"
                    onClick={() => console.log("Export CSV")}
                    fullWidth
                  />
                </div>

                {/* Table */}
                <div>
                  <Table
                    data={MOCK_DATA}
                    columns={columns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default KYCVerificationPage;
