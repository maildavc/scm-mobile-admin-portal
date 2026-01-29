import { SidebarMenuItem } from "@/components/Dashboard/Sidebar";
import { FiHome } from "react-icons/fi";

export const KYC_SIDEBAR_ITEMS: SidebarMenuItem[] = [
  {
    icon: FiHome,
    label: "Overview",
    href: "#",
    isActive: true,
  },
];

export const STATS_CONFIG = [
  {
    label: "Approved KYC",
    value: "20",
  },
  {
    label: "Awaiting Approval",
    value: "20",
  },
  {
    label: "Rejected KYC",
    value: "20",
  },
];

export const PAGE_CONFIG = {
  title: "KYC Verification",
  itemsPerPage: 10,
};

export type KYCRequest = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  verificationType: string;
  status: "Completed" | "Pending Verification" | "Failed";
  initiatedBy: {
    name: string;
    email: string;
  };
  dateRequested: string;
};

export const MOCK_DATA: KYCRequest[] = [
  {
    id: "1",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Identity Verification",
    status: "Completed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "2",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "ID Verification",
    status: "Completed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "3",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "BVN Validation",
    status: "Pending Verification",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "4",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Address Verification",
    status: "Completed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "5",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Signature Capture",
    status: "Failed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "6",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Next of Kin",
    status: "Completed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "7",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Identity Verification",
    status: "Pending Verification",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "8",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "ID Verification",
    status: "Pending Verification",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "9",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "ID Verification",
    status: "Failed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
  {
    id: "10",
    customer: {
      name: "Ayodeji Olawole",
      email: "user@scmcapital.com",
    },
    verificationType: "Identity Verification",
    status: "Failed",
    initiatedBy: {
      name: "Admin Ehizojie",
      email: "ehizojie@scmcapital.com",
    },
    dateRequested: "28/12/2025 13:32",
  },
];

export const getBreadcrumbs = () => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "KYC Verification", active: true },
];
