"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/ProductOffering/StatsCard";
import Table from "@/components/Dashboard/Table";
import Tabs from "@/components/Dashboard/Tabs";
import {
  USERS,
  ROLES,
  DEPARTMENTS,
  USER_ROLE_SIDEBAR_ITEMS,
  STATS_CONFIG,
  PAGE_CONFIG,
  getBreadcrumbs,
} from "@/constants/userRoleManagement/userRoleManagement";
import { createUserColumns } from "./columns";
import { createRoleColumns } from "./roleColumns";
import { createDepartmentColumns } from "./departmentColumns";

type User = {
  id: string;
  name: string;
  email: string;
  roleName: string;
  roleType: string;
  roleExpiry?: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

export default function UserRoleManagement() {
  const [currentView, setCurrentView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Users");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const sidebarItems = USER_ROLE_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: item.label === currentView,
  }));

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setEditUser(null);
    setViewUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    // Navigate/Set view logic if editable
  };

  const handleViewUser = (user: User) => {
    setViewUser(user);
    // Navigate/Set view logic if viewable
  };

  const columns = createUserColumns(handleEditUser, handleViewUser);
  const roleColumns = createRoleColumns();
  const departmentColumns = createDepartmentColumns();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <div className="w-full border-b border-gray-50 md:border-0 md:px-0">
          <PageHeader
            title={PAGE_CONFIG.title}
            breadcrumbs={getBreadcrumbs(currentView)}
          />
        </div>
        <div className="flex-1 flex h-full">
          <Sidebar menuItems={sidebarItems} onItemClick={handleSidebarClick} />

          <main className="flex-1 p-8 bg-white overflow-hidden pt-4 overflow-y-auto">
            {currentView === "Overview" ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                  {STATS_CONFIG.map((stat) => (
                    <StatsCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                    />
                  ))}
                </div>

                <div className="mb-6">
                  <Tabs
                    tabs={["Users", "Roles", "Department"]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </div>

                {activeTab === "Users" ? (
                  <Table
                    data={USERS}
                    columns={columns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                ) : activeTab === "Roles" ? (
                  <Table
                    data={ROLES}
                    columns={roleColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                ) : activeTab === "Department" ? (
                  <Table
                    data={DEPARTMENTS}
                    columns={departmentColumns}
                    itemsPerPage={PAGE_CONFIG.itemsPerPage}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    {activeTab} view coming soon
                  </div>
                )}
              </>
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
