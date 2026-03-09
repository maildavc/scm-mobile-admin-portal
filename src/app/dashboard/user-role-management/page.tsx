"use client";

import React, { useState } from "react";
import Sidebar, { SidebarProvider } from "@/components/Dashboard/Sidebar";
import PageHeader from "@/components/Dashboard/PageHeader";
import StatsCard from "@/components/Dashboard/StatsCard";
import Table from "@/components/Dashboard/Table";
import Tabs from "@/components/Dashboard/Tabs";
import {
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
import { useUsers, useRoles, useDepartments, useDeactivateUser, useApproveUser, useApproveRole, useRejectRole, useApproveDepartment, useRejectDepartment } from "@/hooks/useUserManagement";
import { useToastStore } from "@/stores/toastStore";

type User = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roleName: string;
  roleType: string;
  status: string;
  updated: string;
};

type Role = {
  id: string;
  name: string;
  description?: string;
  status: string;
  updated: string;
};

type Department = {
  id: string;
  name: string;
  description?: string;
  members?: number;
  status: string;
  updated: string;
};

export default function UserRoleManagement() {
  const [currentView, setCurrentView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Users");

  // -- API Queries --
  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    page: 1,
    limit: 100,
  });
  const { data: rolesData, isLoading: isRolesLoading } = useRoles({
    page: 1,
    limit: 100,
  });
  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useDepartments({ page: 1, limit: 100 });

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [viewDepartment, setViewDepartment] = useState<Department | null>(null);
  const isApprover = useAuthStore((s) => s.isApprover);
  const deactivateUser = useDeactivateUser();
  const approveUser = useApproveUser();
  const approveRole = useApproveRole();
  const rejectRole = useRejectRole();
  const approveDepartment = useApproveDepartment();
  const rejectDepartment = useRejectDepartment();
  const addToast = useToastStore((s) => s.addToast);

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

  const usersList = Array.isArray(usersData) ? usersData : [];
  const rolesList = Array.isArray(rolesData) ? rolesData : [];
  const departmentsList = Array.isArray(departmentsData) ? departmentsData : [];

  const columns = createUserColumns(
    handleEditUser,
    handleViewUser,
    handleDeactivateUser,
    isApprover,
    usersList.length,
  );
  const roleColumns = createRoleColumns(
    handleEditRole,
    handleViewRole,
    isApprover,
    rolesList.length,
  );

  const departmentColumns = createDepartmentColumns(
    handleEditDepartment,
    handleViewDepartment,
    isApprover,
    departmentsList.length,
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
                  department={
                    viewDepartment as unknown as {
                      id: string;
                      name: string;
                      description: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                      updated: string;
                    }
                  }
                  onBack={() => setViewDepartment(null)}
                  onApprove={(dept) => {
                    approveDepartment.mutate(dept.id, {
                      onSuccess: () => addToast("Department approved successfully", "success"),
                      onError: () => addToast("Failed to approve department", "error"),
                    });
                  }}
                  onReject={(dept, reason) => {
                    rejectDepartment.mutate({ id: dept.id, reason }, {
                      onSuccess: () => addToast("Department rejected successfully", "success"),
                      onError: () => addToast("Failed to reject department", "error"),
                    });
                  }}
                />
              ) : (
                <ViewDepartment
                  department={
                    viewDepartment as unknown as {
                      id: string;
                      name: string;
                      description: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                      updated: string;
                    }
                  }
                  onEdit={handleEditDepartment}
                  onDeactivate={handleDeactivateDepartment}
                />
              )
            ) : viewRole ? (
              isApprover ? (
                <ApproveRoleRequest
                  role={
                    viewRole as unknown as {
                      id: string;
                      name: string;
                      description: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                      updated: string;
                    }
                  }
                  onBack={() => setViewRole(null)}
                  onApprove={(role) => {
                    approveRole.mutate(role.id, {
                      onSuccess: () => addToast("Role approved successfully", "success"),
                      onError: () => addToast("Failed to approve role", "error"),
                    });
                  }}
                  onReject={(role, reason) => {
                    rejectRole.mutate({ id: role.id, reason }, {
                      onSuccess: () => addToast("Role rejected successfully", "success"),
                      onError: () => addToast("Failed to reject role", "error"),
                    });
                  }}
                />
              ) : (
                <ViewRole
                  role={
                    viewRole as unknown as {
                      id: string;
                      name: string;
                      description: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                      updated: string;
                    }
                  }
                  onBack={() => setViewRole(null)}
                  onEdit={handleEditRole}
                  onDeactivate={handleDeactivateRole}
                />
              )
            ) : viewUser ? (
              isApprover ? (
                <ApproveUserRequest
                  user={
                    viewUser as unknown as {
                      id: string;
                      name: string;
                      email: string;
                      roleName: string;
                      roleType: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                    }
                  }
                  onBack={() => setViewUser(null)}
                  onApprove={(user) => {
                    approveUser.mutate(
                      { id: user.id, action: "approve" },
                      {
                        onSuccess: () => addToast("User approved successfully", "success"),
                        onError: () => addToast("Failed to approve user", "error"),
                      },
                    );
                  }}
                  onReject={(user, reason) => {
                    approveUser.mutate(
                      { id: user.id, action: "reject", reason },
                      {
                        onSuccess: () => addToast("User rejected successfully", "success"),
                        onError: () => addToast("Failed to reject user", "error"),
                      },
                    );
                  }}
                />
              ) : (
                <ViewUser
                  user={
                    viewUser as unknown as {
                      id: string;
                      name: string;
                      email: string;
                      roleName: string;
                      roleType: string;
                      status: "Active" | "Deactivated" | "Awaiting Approval";
                    }
                  }
                  onBack={() => setViewUser(null)}
                  onEdit={(user) => {
                    setEditUser(user);
                    setViewUser(null);
                  }}
                  onDeactivate={(user) => {
                    deactivateUser.mutate(user.id, {
                      onSuccess: () => {
                        addToast("Deactivation request sent for approval", "success");
                        setViewUser(null);
                      },
                      onError: () => {
                        addToast("Failed to send deactivation request", "error");
                      },
                    });
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
                  isUsersLoading ? (
                    <div className="flex items-center justify-center p-8">
                      Loading users...
                    </div>
                  ) : (
                    <Table
                      data={usersList.map((u) => ({
                        ...u,
                        name:
                          u.name ||
                          `${u.firstName} ${u.lastName}`.trim() ||
                          "Unknown User",
                        roleName: u.roleName || "Unassigned",
                        roleType: u.roleType || "Permanent",
                        status: u.status as
                          | "Active"
                          | "Deactivated"
                          | "Awaiting Approval",
                        updated:
                          u.updated || u.updatedAt || u.createdAt || "N/A",
                      }))}
                      columns={columns}
                      itemsPerPage={PAGE_CONFIG.itemsPerPage}
                    />
                  )
                ) : activeTab === "Roles" ? (
                  isRolesLoading ? (
                    <div className="flex items-center justify-center p-8">
                      Loading roles...
                    </div>
                  ) : (
                    <Table
                      data={rolesList.map((r) => ({
                        ...r,
                        description: r.description || "No description provided",
                        status: r.status as
                          | "Active"
                          | "Deactivated"
                          | "Awaiting Approval",
                        updated:
                          r.updated || r.updatedAt || r.createdAt || "N/A",
                      }))}
                      columns={roleColumns}
                      itemsPerPage={PAGE_CONFIG.itemsPerPage}
                    />
                  )
                ) : activeTab === "Department" ? (
                  isDepartmentsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      Loading departments...
                    </div>
                  ) : (
                    <Table
                      data={departmentsList.map((d) => ({
                        ...d,
                        description: d.description || "No description provided",
                        members: d.members || 0,
                        status: d.status as
                          | "Active"
                          | "Deactivated"
                          | "Awaiting Approval",
                        updated:
                          d.updated || d.updatedAt || d.createdAt || "N/A",
                      }))}
                      columns={departmentColumns}
                      itemsPerPage={PAGE_CONFIG.itemsPerPage}
                    />
                  )
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
                editRole={
                  editRole as unknown as {
                    id: string;
                    name: string;
                    description: string;
                    status: "Active" | "Deactivated" | "Awaiting Approval";
                    updated: string;
                  } | null
                }
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
