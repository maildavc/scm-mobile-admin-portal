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
  organizationId?: string;
  createdBy?: string;
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
  role?: string;
  roleId?: string;
  roleName?: string;
  roleType?: string;
  roleExpiry?: string;
  expiryStatus?: string;
  expires?: string | null;
  dateCreated?: string;
  dateModified?: string;
  departmentId?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  updated?: string;
  profileImageUrl?: string;
}

export interface CreateUserRequest {
  basicInformation: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  department?: string;
  assignRole: {
    role: string;
    expiryStatus: string;
    expires?: string;
    departmentId?: string;
  };
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
