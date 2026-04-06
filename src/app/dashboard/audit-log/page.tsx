"use client";

import React from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import Table from "@/components/Dashboard/Table";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  AUDIT_LOG_SIDEBAR_ITEMS,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/auditLog/auditLog";
import { columns } from "./columns";
import { useAuditLogs } from "@/hooks/useAuditLog";
import { auditLogService } from "@/services/auditLogService";

const AuditLogPage = () => {
  const [currentView, setCurrentView] = React.useState("Audit Log");

  // Fetching data - grabbing enough limit for client side pagination locally, 
  // since Table.tsx doesn't natively support server-side events out of the box.
  const { data: auditResponse, isLoading } = useAuditLogs({
    page: 1,
    limit: 100,
  });

  const auditData = auditResponse?.data || [];

  const handleExportCSV = async () => {
    try {
      const blob = await auditLogService.exportAuditLogs({});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Failed to export audit logs", e);
    }
  };

  const sidebarItems = AUDIT_LOG_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: item.label === currentView,
  }));

  const breadcrumbs = getBreadcrumbs(currentView);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={sidebarItems}
            onItemClick={(label) => setCurrentView(label)}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            <div className="flex flex-col gap-6">


              {/* Action Cards */}
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
                  onClick={handleExportCSV}
                  fullWidth
                />
              </div>

              {/* Table */}
              <div>
                <Table
                  data={auditData}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuditLogPage;
