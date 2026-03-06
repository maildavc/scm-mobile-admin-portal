export interface Department {
  id: string;
  name: string;
  description?: string;
  members?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  updated?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

export interface ReassignUsersRequest {
  userIds: string[];
  newDepartmentId?: string;
  newRoleId?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
  updated?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // combination of real name for UI
  email: string;
  phoneNumber?: string;
  roleId?: string;
  roleName?: string;
  roleType?: string;
  roleExpiry?: string;
  departmentId?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  updated?: string;
  profileImageUrl?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roleId: string;
  departmentId?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
