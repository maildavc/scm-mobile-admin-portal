import {
  FiBox,
  FiUsers,
  FiShield,
  FiFile,
  FiCheckCircle,
  FiLink2,
} from "react-icons/fi";
import { RiChat3Line } from "react-icons/ri";

export const DASHBOARD_CARDS = [
  {
    icon: FiBox,
    title: "Product Offering",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
    path: "/dashboard/product-offering",
  },
  {
    icon: FiUsers,
    title: "Customer Management",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
    path: "/dashboard/customer-management",
  },
  {
    icon: FiShield,
    title: "User & Role Management",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
    path: "/dashboard/user-role-management",
  },
  {
    icon: FiFile,
    title: "Audit Log",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
    path: "/dashboard/audit-log",
  },
  {
    icon: FiCheckCircle,
    title: "KYC Verification",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
  },
  {
    icon: RiChat3Line,
    title: "Customer Service",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
  },
  {
    icon: FiLink2,
    title: "Integrations",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
  },
  {
    icon: FiLink2, // Using Link icon as per screenshot for Notifs
    title: "Notifications",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
  },
  {
    icon: FiLink2, // Using Link icon as per screenshot for Blog
    title: "Blog",
    description:
      "Manage customer profiles, update KYC, view customer details and many more in this module",
  },
];
