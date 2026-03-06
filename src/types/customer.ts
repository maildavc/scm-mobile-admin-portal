import { StatusType } from "@/components/Dashboard/StatusBadge";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: StatusType | string;
  kycStatus: StatusType | string;
  createdAt: string;
  updatedAt?: string;
  products?: unknown[];
  tier?: string;
  requestType?: string;
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
  email: string;
  phone: string;
}

export interface UpdateCustomerRequest {
  customerId: string;
  name: string;
  email: string;
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
