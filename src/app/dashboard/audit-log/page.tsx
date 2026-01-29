"use client";

import React from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import Table from "@/components/Dashboard/Table";
import StatsCard from "@/components/Dashboard/StatsCard";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  AUDIT_LOG_SIDEBAR_ITEMS,
  PAGE_CONFIG,
  getBreadcrumbs,
  SUMMARY_CARDS,
  MOCK_DATA,
} from "@/constants/auditLog/auditLog";
import { columns } from "./columns";

const AuditLogPage = () => {
  const [currentView, setCurrentView] = React.useState("Customers");

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
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {SUMMARY_CARDS.map((card) => (
                  <StatsCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                  />
                ))}
              </div>

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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuditLogPage;
