import {
  FiUsers,
  FiSettings,
  FiFile,
  FiCheckCircle,
  FiShield,
  FiLink2,
} from "react-icons/fi";
import { RiChat3Line } from "react-icons/ri";
import { SidebarMenuItem } from "@/components/Dashboard/Sidebar";

export const AUDIT_LOG_SIDEBAR_ITEMS: SidebarMenuItem[] = [
  {
    icon: FiUsers,
    label: "Customers",
    href: "#",
    isActive: true,
  },
  {
    icon: FiSettings,
    label: "Product Offering",
    href: "#",
    isActive: false,
  },
  {
    icon: FiFile,
    label: "Audit Log",
    href: "#",
    isActive: false,
  },
  {
    icon: FiCheckCircle,
    label: "KYC Verification",
    href: "#",
    isActive: false,
  },
  {
    icon: RiChat3Line,
    label: "Customer Service",
    href: "#",
    isActive: false,
  },
  {
    icon: FiShield,
    label: "User & Role Mgt.",
    href: "#",
    isActive: false,
  },
  {
    icon: FiLink2,
    label: "Integrations",
    href: "#",
    isActive: false,
  },
];

export const PAGE_CONFIG = {
  title: "Audit Log",
  itemsPerPage: 10,
};

export const getBreadcrumbs = (currentView: string) => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Audit Log", href: "/dashboard/audit-log" },
  { label: currentView, active: true },
];

export const SUMMARY_CARDS = [
  {
    label: "Active Products",
    value: "20",
  },
  {
    label: "Inactive Products",
    value: "20",
  },
  {
    label: "Unsubscribed Products",
    value: "20",
  },
];

export type AuditLogItem = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  userType: "Admin User" | "Customer";
  action: string;
  dataPassed: string;
  anotherColumn: string;
  anotherColumn2: string;
};

export const MOCK_DATA: AuditLogItem[] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    user: {
      name: "Ehizojie Ihayere",
      email: "ehizojie@scmcapital.com",
    },
    userType: i % 2 === 0 ? "Admin User" : "Customer",
    action: "Name of action carried out here",
    dataPassed: "What type of data should diplay here in a string",
    anotherColumn: "information written here",
    anotherColumn2: "information written here",
  }));
