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

const IntegrationsPage = () => {
  const breadcrumbs = getBreadcrumbs();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={INTEGRATIONS_SIDEBAR_ITEMS}
            onItemClick={(label) => console.log(label)}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
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

export default IntegrationsPage;
