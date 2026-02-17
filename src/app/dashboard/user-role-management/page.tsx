"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
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
import { useAuthStore } from "@/stores/authStore";
import { createUserColumns } from "./columns";
import { createRoleColumns } from "./roleColumns";
import { createDepartmentColumns } from "./departmentColumns";
import CreateUserForm from "@/components/Dashboard/UserRoleManagement/CreateUserForm";
import CreateRoleForm from "@/components/Dashboard/UserRoleManagement/CreateRoleForm";
import CreateDepartmentForm from "@/components/Dashboard/UserRoleManagement/CreateDepartmentForm";
import ViewUser from "@/components/Dashboard/UserRoleManagement/ViewUser";
import ApproveUserRequest from "@/components/Dashboard/UserRoleManagement/ApproveUserRequest";
import ViewRole from "@/components/Dashboard/UserRoleManagement/ViewRole";
import ApproveRoleRequest from "@/components/Dashboard/UserRoleManagement/ApproveRoleRequest";
import ViewDepartment from "@/components/Dashboard/UserRoleManagement/ViewDepartment";
import ApproveDepartmentRequest from "@/components/Dashboard/UserRoleManagement/ApproveDepartmentRequest";
import ActionButton from "@/components/Dashboard/ActionButton";

type User = {
  // ... User type stays same
  id: string;
  name: string;
  email: string;
  roleName: string;
  roleType: string;
  roleExpiry?: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

type Department = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

export default function UserRoleManagement() {
  const [currentView, setCurrentView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Users");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [viewDepartment, setViewDepartment] = useState<Department | null>(null);
  const isApprover = useAuthStore((s) => s.isApprover);

  const allSidebarItems = USER_ROLE_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: item.label === currentView,
  }));

  const sidebarItems = isApprover
    ? allSidebarItems.filter((item) => item.label === "Overview")
    : allSidebarItems;

  const handleSidebarClick = (label: string) => {
    setCurrentView(label);
    setEditUser(null);
    setEditRole(null);
    setViewUser(null);
    setViewRole(null);
    setViewDepartment(null);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setCurrentView("Create New User");
    setViewUser(null);
  };

  const handleViewUser = (user: User) => {
    setViewUser(user);
  };

  const handleDeactivateUser = (user: User) => {
    setViewUser(user);
  };

  const handleViewRole = (role: Role) => {
    setViewRole(role);
  };

  const handleEditRole = (role: Role) => {
    setEditRole(role);
    setCurrentView("Create New Role");
    setViewRole(null);
  };

  const handleDeactivateRole = (role: Role) => {
    setViewRole(role);
  };

  const handleViewDepartment = (department: Department) => {
    setViewDepartment(department);
  };

  const handleEditDepartment = (department: Department) => {
    console.log("Edit department:", department);
    // TODO: Implement edit department functionality
  };

  const handleDeactivateDepartment = (department: Department) => {
    setViewDepartment(department);
  };

  const columns = createUserColumns(
    handleEditUser,
    handleViewUser,
    handleDeactivateUser,
    isApprover,
  );
  const roleColumns = createRoleColumns(
    handleEditRole,
    handleViewRole,
    isApprover,
  );
  const departmentColumns = createDepartmentColumns(
    handleEditDepartment,
    handleViewDepartment,
    isApprover,
  );

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
            {viewDepartment ? (
              isApprover ? (
                <ApproveDepartmentRequest
                  department={viewDepartment}
                  onBack={() => setViewDepartment(null)}
                />
              ) : (
                <ViewDepartment
                  department={viewDepartment}
                  onEdit={handleEditDepartment}
                  onDeactivate={handleDeactivateDepartment}
                />
              )
            ) : viewRole ? (
              isApprover ? (
                <ApproveRoleRequest
                  role={viewRole}
                  onBack={() => setViewRole(null)}
                  onApprove={(role) => {
                    console.log("Approve role:", role);
                    // Approval logic handled in component
                  }}
                  onReject={(role, reason) => {
                    console.log("Reject role:", role, "Reason:", reason);
                    // Rejection logic handled in component
                  }}
                />
              ) : (
                <ViewRole
                  role={viewRole}
                  onBack={() => setViewRole(null)}
                  onEdit={handleEditRole}
                  onDeactivate={handleDeactivateRole}
                />
              )
            ) : viewUser ? (
              isApprover ? (
                <ApproveUserRequest
                  user={viewUser}
                  onBack={() => setViewUser(null)}
                  onApprove={(user) => {
                    console.log("Approve user:", user);
                    // Approval logic handled in component
                  }}
                  onReject={(user, reason) => {
                    console.log("Reject user:", user, "Reason:", reason);
                    // Rejection logic handled in component
                  }}
                />
              ) : (
                <ViewUser
                  user={viewUser}
                  onBack={() => setViewUser(null)}
                  onEdit={(user) => {
                    setEditUser(user);
                    setViewUser(null);
                  }}
                  onDeactivate={(user) => {
                    console.log("Deactivate user:", user);
                    // Add deactivation logic here
                  }}
                />
              )
            ) : currentView === "Overview" ? (
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

                <div className="mb-6 flex items-center justify-between">
                  <Tabs
                    tabs={["Users", "Roles", "Department"]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                  <div className="flex gap-3">
                    <ActionButton
                      onClick={() => console.log("Download clicked")}
                      label="Download Table as PDF"
                      actionText="Download"
                    />
                    <ActionButton
                      onClick={() => console.log("Export clicked")}
                      label="Export Table as CSV"
                      actionText="Export"
                    />
                  </div>
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
            ) : currentView === "Create New User" ? (
              <CreateUserForm
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditUser(null);
                }}
                onSuccess={() => {
                  setCurrentView("Overview");
                  setEditUser(null);
                }}
                initialData={
                  editUser
                    ? {
                        "Full Name": editUser.name,
                        "Email Address": editUser.email,
                        "Role Name": editUser.roleName,
                        "Role Type": editUser.roleType,
                      }
                    : undefined
                }
              />
            ) : currentView === "Create New Role" ? (
              <CreateRoleForm
                editRole={editRole}
                onCancel={() => {
                  setCurrentView("Overview");
                  setEditRole(null);
                }}
                onSuccess={() => {
                  setCurrentView("Overview");
                  setEditRole(null);
                }}
              />
            ) : currentView === "Create Department" ? (
              <CreateDepartmentForm
                onCancel={() => setCurrentView("Overview")}
                onSuccess={() => setCurrentView("Overview")}
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
