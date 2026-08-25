import { StatusType } from "@/components/Dashboard/StatusBadge";

export interface CustomerProductAssignmentPayload {
  productId: string;
  canBuy: boolean;
  canSell: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  citizenship?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  profileImageUrl?: string | null;
  status: StatusType | string;
  kycStatus: StatusType | string;
  createdAt: string;
  updatedAt?: string;
  products?: unknown[];
  tier?: string;
  requestType?: string;
  /** Backend distinguishes portal users (`user`) from admin-created customers (`customer`). */
  sourceType?: "user" | "customer" | string;
  productAssignments?: CustomerProductAssignmentPayload[];
}

export interface GetCustomersParams {
  page: number;
  limit: number;
  status?: string;
  kycStatus?: string;
  search?: string;
}

export interface CreateCustomerRequest {
  name: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship?: string;
  gender?: string;
  dateOfBirth?: string;
  /** Omit entirely when empty — backend 500s on `[]`. */
  productAssignments?: CustomerProductAssignmentPayload[];
}

export interface UpdateCustomerRequest {
  customerId?: string;
  id?: string;
  name: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship?: string;
  gender?: string;
  dateOfBirth?: string;
  productAssignments?: CustomerProductAssignmentPayload[];
}

export interface GetCustomersResponse {
  status: string;
  data: Customer[];
  totalCount: number;
}

export interface SingleCustomerResponse {
  status: string;
  message?: string;
  data: Customer;
}

export interface SimpleActionResponse {
  status: string;
  message: string;
  data?: unknown;
}
