"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import ActionButton from "@/components/Dashboard/ActionButton";
import {
  NOTIFICATIONS,
  NOTIFICATION_SIDEBAR_ITEMS,
  STATS_CONFIG,
  APPROVER_STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/notificationService/notificationService";
import { createNotificationColumns } from "./columns";
import { useAuthStore } from "@/stores/authStore";

import CreateNotificationForm from "@/components/Dashboard/NotificationService/CreateNotificationForm";
import NotificationSettings from "@/components/Dashboard/NotificationService/NotificationSettings";
import ViewNotificationRequest from "@/components/Dashboard/NotificationService/ViewNotificationRequest";

type Notification = {
  id: string;
  name: string;
  audience: string;
  channel: string;
  type: string;
  status:
    | "Sent"
    | "Sending"
    | "Draft"
    | "Failed"
    | "Awaiting Approval"
    | "Approved";
  approverStatus:
    | "Sent"
    | "Sending"
    | "Draft"
    | "Failed"
    | "Awaiting Approval"
    | "Approved";
  sent: number;
  delivered: number;
  dateCreated: string;
};

export default function NotificationService() {
  const [currentView, setCurrentView] = useState("Overview");
  const [viewNotification, setViewNotification] = useState<Notification | null>(
    null,
  );
  const isApprover = useAuthStore((s) => s.isApprover);

  const sidebarItems = isApprover
    ? NOTIFICATION_SIDEBAR_ITEMS.filter((item) => item.label === "Overview")
    : NOTIFICATION_SIDEBAR_ITEMS;

  // Set active state
  const activeSidebarItems = sidebarItems.map((item) => ({
    ...item,
    isActive: viewNotification
      ? item.label === "Overview"
      : item.label === "Create Notification"
        ? currentView === "Create Notification"
        : item.label === currentView,
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setViewNotification(null);
  };

  const handleViewNotification = (notification: Notification) => {
    setViewNotification(notification);
    setCurrentView(notification.name);
  };

  const resetView = () => {
    setCurrentView("Overview");
    setViewNotification(null);
  };

  const breadcrumbs = getBreadcrumbs(
    viewNotification ? viewNotification.name : currentView,
  );
  const currentStats = isApprover ? APPROVER_STATS_CONFIG : STATS_CONFIG;
  const columns = createNotificationColumns(isApprover, handleViewNotification);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader title={PAGE_CONFIG.title} breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar
            menuItems={activeSidebarItems}
            onItemClick={handleSidebarClick}
          />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {viewNotification ? (
              <ViewNotificationRequest
                notification={viewNotification}
                onApprove={resetView}
                onReject={resetView}
              />
            ) : currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  {currentStats.map((stat, index) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      showLink={false}
                      // Make the 3rd card span 2 cols on small screens if there are only 3 cards
                      className={
                        currentStats.length === 3 && index === 2
                          ? "col-span-2 md:col-span-1"
                          : ""
                      }
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center gap-3 mb-6">
                  <div className="flex-1">
                    <ActionButton
                      onClick={() => console.log("Download clicked")}
                      label="Download Table as PDF"
                      actionText="Download"
                      fullWidth
                    />
                  </div>
                  <div className="flex-1">
                    <ActionButton
                      onClick={() => console.log("Export clicked")}
                      label="Export Table as CSV"
                      actionText="Export"
                      fullWidth
                    />
                  </div>
                </div>

                <Table
                  data={NOTIFICATIONS}
                  columns={columns}
                  itemsPerPage={PAGE_CONFIG.itemsPerPage}
                />
              </>
            ) : currentView === "Create Notification" ? (
              <CreateNotificationForm
                onSuccess={() => setCurrentView("Overview")}
                onCancel={() => setCurrentView("Overview")}
              />
            ) : currentView === "Notification Settings" ? (
              <NotificationSettings
                onSuccess={() => setCurrentView("Overview")}
                onCancel={() => setCurrentView("Overview")}
              />
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
