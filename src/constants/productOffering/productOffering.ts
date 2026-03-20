import { FiBox, FiHome } from "react-icons/fi";

export const PRODUCT_OFFERING_SIDEBAR_ITEMS = [
  { icon: FiHome, label: "Overview", href: "#", isActive: true },
  { icon: FiBox, label: "Create Product", href: "#" },
];

export const PAGE_CONFIG = {
  title: "Product Offering",
  itemsPerPage: 10,
};

export const getBreadcrumbs = (activeItem?: string) => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Product Offering", href: "/dashboard/product-offering" },
  ...(activeItem && activeItem !== "Overview" ? [{ label: activeItem }] : []),
];
