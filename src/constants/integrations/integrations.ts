// removed mock Integration type
import { FiHome, FiLink2 } from "react-icons/fi";

export const INTEGRATIONS_SIDEBAR_ITEMS = [
  {
    label: "Overview",
    isActive: true,
    icon: FiHome,
    href: "/dashboard/integrations",
  },
  {
    label: "Connect New",
    isActive: false,
    icon: FiLink2,
    href: "/dashboard/integrations/new",
  },
];

export const PAGE_CONFIG = {
  title: "Integrations",
  itemsPerPage: 10,
};

// removed MOCK_DATA
export const getBreadcrumbs = () => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Integrations", active: true },
];
