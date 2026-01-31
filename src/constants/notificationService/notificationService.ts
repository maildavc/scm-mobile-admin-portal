import { FiBell, FiHome, FiLink2 } from "react-icons/fi";

export const NOTIFICATION_SIDEBAR_ITEMS = [
  {
    icon: FiHome,
    label: "Overview",
    href: "/dashboard/notification-service",
  },
  {
    icon: FiBell,
    label: "Create Notification",
    href: "/dashboard/notification-service/create",
  },
  {
    icon: FiLink2,
    label: "Notification Settings",
    href: "/dashboard/notification-service/settings",
  },
];

export const STATS_CONFIG = [
  {
    label: "Total Customers",
    value: "20",
  },
  {
    label: "Sent Notifications",
    value: "20",
  },
  {
    label: "Delayed Notifications",
    value: "20",
  },
];

export const APPROVER_STATS_CONFIG = [
  {
    label: "All Notifications",
    value: "20",
  },
  {
    label: "Awaiting Approval Notifications",
    value: "20",
  },
  {
    label: "Approved Notifications",
    value: "20",
  },
];

export const PAGE_CONFIG = {
  title: "Notification Service",
  itemsPerPage: 10,
};

export const NOTIFICATIONS = [
  {
    id: "NOT-001",
    name: "Promo Notification",
    audience: "All Users",
    channel: "Email",
    type: "System",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-002",
    name: "Title of Notification Here",
    audience: "Segment",
    channel: "In-App",
    type: "Transactional",
    status: "Awaiting Approval" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-003",
    name: "Title of Notification Here",
    audience: "All Users",
    channel: "Email",
    type: "Marketing",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-004",
    name: "Title of Notification Here",
    audience: "Segment",
    channel: "In-App",
    type: "System",
    status: "Awaiting Approval" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-005",
    name: "Title of Notification Here",
    audience: "All Users",
    channel: "Email",
    type: "Transactional",
    status: "Awaiting Approval" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-006",
    name: "Title of Notification Here",
    audience: "Segment",
    channel: "In-App",
    type: "Marketing",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-007",
    name: "Title of Notification Here",
    audience: "All Users",
    channel: "In-App",
    type: "System",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-008",
    name: "Title of Notification Here",
    audience: "Segment",
    channel: "Email",
    type: "Transactional",
    status: "Awaiting Approval" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-009",
    name: "Title of Notification Here",
    audience: "All Users",
    channel: "In-App",
    type: "Transactional",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
  {
    id: "NOT-010",
    name: "Title of Notification Here",
    audience: "Segment",
    channel: "In-App",
    type: "Marketing",
    status: "Approved" as const,
    sent: 135,
    delivered: 102,
    dateCreated: "28/12/2025 13:32",
  },
];

export const getBreadcrumbs = (currentView: string) => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Notification Service", href: "/dashboard/notification-service" },
];
