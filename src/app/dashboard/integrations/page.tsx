"use client";

import React from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import Table from "@/components/Dashboard/Table";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  INTEGRATIONS_SIDEBAR_ITEMS,
  PAGE_CONFIG,
  MOCK_DATA,
  getBreadcrumbs,
} from "@/constants/integrations/integrations";
import { columns } from "./columns";
import ConnectNewIntegration from "@/components/Dashboard/Integrations/ConnectNewIntegration";
import ViewIntegration from "@/components/Dashboard/Integrations/ViewIntegration";
import { Integration } from "@/constants/integrations/integrations";

import RemoveIntegrationModal from "@/components/Dashboard/Integrations/RemoveIntegrationModal";
import Button from "@/components/Button";
import Image from "next/image";

const IntegrationsPage = () => {
  const [view, setView] = React.useState<
    "overview" | "connect-new" | "view-integration" | "success"
  >("overview");
  const [selectedIntegration, setSelectedIntegration] =
    React.useState<Integration | null>(null);
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);

  // Create a mutable copy with proper types
  const breadcrumbs: {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }[] = [...getBreadcrumbs()];

  if (view === "connect-new") {
    breadcrumbs.push({
      label: selectedIntegration ? "Edit Integration" : "Connect New",
      active: true,
    });
    // Make Integrations link active/clickable to go back
    breadcrumbs[1] = {
      ...breadcrumbs[1],
      active: false,
      onClick: () => {
        setView("overview");
        setSelectedIntegration(null);
      },
      href: undefined,
    };
  } else if (view === "view-integration" && selectedIntegration) {
    breadcrumbs.push({ label: selectedIntegration.name, active: true });
    // Make Integrations link active/clickable to go back
    breadcrumbs[1] = {
      ...breadcrumbs[1],
      active: false,
      onClick: () => {
        setView("overview");
        setSelectedIntegration(null);
      },
      href: undefined,
    };
  } else if (view === "success") {
    // No extra breadcrumb maybe? Or keep the last one?
    // Usually success screens might not need complex breadcrumbs or just point to Overview
  }

  const handleSidebarClick = (label: string) => {
    if (label === "Connect New") {
      setView("connect-new");
      setSelectedIntegration(null);
    } else if (label === "Overview") {
      setView("overview");
      setSelectedIntegration(null);
    }
  };

  const handleViewIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setView("view-integration");
  };

  const handleEditIntegration = () => {
    // Switch to Connect New view but with prefilled data
    setView("connect-new");
  };

  const handleRemoveIntegration = () => {
    setShowRemoveModal(true);
  };

  const confirmRemoveIntegration = () => {
    setShowRemoveModal(false);
    setView("success");
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={INTEGRATIONS_SIDEBAR_ITEMS.map((item) => ({
              ...item,
              isActive:
                (view === "overview" && item.label === "Overview") ||
                (view === "connect-new" && item.label === "Connect New") ||
                (view === "view-integration" && item.label === "Overview") ||
                (view === "success" && item.label === "Overview"),
            }))}
            onItemClick={handleSidebarClick}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {view === "connect-new" ? (
              <ConnectNewIntegration
                initialData={
                  selectedIntegration
                    ? {
                        name: selectedIntegration.name,
                        description: selectedIntegration.description,
                        clientUrl: "https://accessbankplc.com.ng", // Mock data
                        clientSecretKey: "mock-secret-key",
                        username: "mock-user",
                        password: "mock-password",
                      }
                    : undefined
                }
                onCancel={() => {
                  if (selectedIntegration) {
                    setView("view-integration");
                  } else {
                    setView("overview");
                  }
                }}
                onTestConnection={(data) => {
                  console.log("Test/Save Connection", data);
                  if (selectedIntegration) {
                    // Navigate back to view integration after save
                    setView("view-integration");
                  } else {
                    setView("overview");
                  }
                }}
              />
            ) : view === "view-integration" && selectedIntegration ? (
              <ViewIntegration
                integration={selectedIntegration}
                onRemove={handleRemoveIntegration}
                onEdit={handleEditIntegration}
              />
            ) : view === "success" ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-6">
                  <Image
                    src="/success.svg"
                    alt="Success"
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#2F3140] mb-2">
                  Integration disconnected
                </h3>
                <p className="text-sm text-[#707781] mb-8 text-center">
                  Integration was successfully disconnected
                </p>
                <div className="w-32">
                  <Button
                    text="Done"
                    variant="primary"
                    onClick={() => {
                      setView("overview");
                      setSelectedIntegration(null);
                    }}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
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
                    columns={columns(handleViewIntegration)}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Remove Integration Modal */}
      <RemoveIntegrationModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={confirmRemoveIntegration}
        integrationName={selectedIntegration?.name || ""}
      />
    </SidebarProvider>
  );
};

export default IntegrationsPage;
