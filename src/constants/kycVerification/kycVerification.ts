import { SidebarMenuItem } from "@/components/Dashboard/Sidebar";
import { FiHome } from "react-icons/fi";
import { StatusType } from "@/components/Dashboard/StatusBadge";

export const KYC_SIDEBAR_ITEMS: SidebarMenuItem[] = [
  {
    icon: FiHome,
    label: "Overview",
    href: "#",
    isActive: true,
  },
];

export const STATS_CONFIG = [
  { label: "Approved KYC" },
  { label: "Awaiting Approval" },
  { label: "Rejected KYC" },
];

export const PAGE_CONFIG = {
  title: "KYC Verification",
  itemsPerPage: 10,
};

export type KYCRequest = {
  id: string;
  customerId: string;
  customer: {
    name: string;
    email: string;
  };
  verificationType: string;
  status: StatusType | string;
  initiatedBy: {
    name: string;
    email: string;
  };
  dateRequested: string;
  reviewedBy?: string;
  rejectionReason?: string;
};

export const getBreadcrumbs = () => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "KYC Verification", active: true },
];
