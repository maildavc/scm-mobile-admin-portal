"use client";

import React, { useMemo, useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import Table from "@/components/Dashboard/Table";
import StatsCard from "@/components/Dashboard/StatsCard";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  KYC_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
  KYCRequest,
} from "@/constants/kycVerification/kycVerification";
import { createColumns } from "./columns";
import ViewKYCRequest from "@/components/Dashboard/KYCVerification/ViewKYCRequest";
import { useKycRequests } from "@/hooks/useKyc";
import { formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";

const normalizeStatus = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

const mapKycStatus = (statusName?: string) => {
  const normalized = normalizeStatus(statusName);
  if (!normalized || normalized === "pending") return "Pending Verification";
  if (normalized === "approved" || normalized === "completed") return "Approved";
  if (normalized === "rejected" || normalized === "failed") return "Rejected";
  return statusName || "Pending Verification";
};

const KYCVerificationPage = () => {
  const [viewRequest, setViewRequest] = useState<KYCRequest | null>(null);
  const { data: rawRequests, isLoading } = useKycRequests();

  const handleViewRequest = (request: KYCRequest) => {
    setViewRequest(request);
  };

  const handleBack = () => {
    setViewRequest(null);
  };

  const mappedData: KYCRequest[] = useMemo(() => {
    if (!rawRequests) return [];
    return rawRequests.map((req) => ({
      id: req.id,
      customerId: req.customerId || "",
      customer: {
        name: req.customer?.fullName || "Unknown Customer",
        email: req.customer?.email || "No Email",
      },
      verificationType: req.levelName || req.typeName || "KYC Verification",
      status: mapKycStatus(req.statusName),
      initiatedBy: {
        name: req.createdBy || req.customer?.fullName || "System",
        email: req.customer?.email || "",
      },
      dateRequested: formatDateTimeDdMmYyyy(req.submittedAt || req.createdAt),
      reviewedBy: req.reviewerName || req.reviewedBy,
      rejectionReason: req.rejectionReason,
    }));
  }, [rawRequests]);

  const columns = createColumns(handleViewRequest, mappedData.length);

  const stats = useMemo(() => {
    const approved = mappedData.filter((r) =>
      ["approved", "completed"].includes(normalizeStatus(r.status)),
    ).length;
    const awaiting = mappedData.filter((r) => {
      const status = normalizeStatus(r.status);
      return status.includes("pending") || status.includes("awaiting");
    }).length;
    const rejected = mappedData.filter((r) =>
      ["rejected", "failed"].includes(normalizeStatus(r.status)),
    ).length;

    return {
      "Approved KYC": String(approved),
      "Awaiting Approval": String(awaiting),
      "Rejected KYC": String(rejected),
    } as Record<string, string>;
  }, [mappedData]);

  const breadcrumbs: {
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }[] = [...getBreadcrumbs()];

  if (viewRequest) {
    const kycCrumbIndex = breadcrumbs.findIndex((b) => b.label === "KYC Verification");
    if (kycCrumbIndex !== -1) {
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {STATS_CONFIG.map((stat) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stats[stat.label] || "0"}
                      showLink={false}
                    />
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <ActionButton label="Download Table as PDF" actionText="Download" fullWidth />
                  <ActionButton label="Export Table as CSV" actionText="Export" fullWidth />
                </div>

                <Table
                  data={mappedData}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  isLoading={isLoading}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default KYCVerificationPage;
