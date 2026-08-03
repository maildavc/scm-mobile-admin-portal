import { FiBox, FiUsers, FiShield, FiFile, FiCheckCircle, FiLink2 } from "react-icons/fi";
import { RiChat3Line } from "react-icons/ri";

export const DASHBOARD_CARDS = [
  {
    icon: FiBox,
    title: "Product Offering",
    description: "Create, configure, approve, activate, and deactivate investment products.",
    path: "/dashboard/product-offering",
  },
  {
    icon: FiUsers,
    title: "Customer Management",
    description: "Manage customer profiles, documents, assigned products, and account status.",
    path: "/dashboard/customer-management",
  },
  {
    icon: FiShield,
    title: "User & Role Management",
    description: "Administer users, departments, roles, permissions, and approval requests.",
    path: "/dashboard/user-role-management",
  },
  {
    icon: FiFile,
    title: "Audit Log",
    description: "Review administrative activity, filter events, and export audit records.",
    path: "/dashboard/audit-log",
  },
  {
    icon: FiCheckCircle,
    title: "KYC Verification",
    description: "Inspect submitted identity documents and approve or reject KYC requests.",
    path: "/dashboard/kyc-verification",
  },
  {
    icon: RiChat3Line,
    title: "Customer Service",
    description: "Create support requests and manage customer conversations and replies.",
    path: "/dashboard/customer-service",
  },
  {
    icon: FiLink2,
    title: "Integrations",
    description: "Configure external API connections, test connectivity, and inspect logs.",
    path: "/dashboard/integrations",
  },
  {
    icon: FiLink2,
    title: "Notifications",
    description: "Draft, approve, schedule, send, and track customer notifications.",
    path: "/dashboard/notifications",
  },
  {
    icon: FiLink2,
    title: "Blog & FAQs",
    description: "Create, review, publish, feature, and archive customer-facing content.",
    path: "/dashboard/blog-and-faqs",
  },
];
