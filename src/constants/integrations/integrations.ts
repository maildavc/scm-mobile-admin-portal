export type Integration = {
  id: string;
  name: string;
  description: string;
  icon?: string; // URL or placeholder for now
  status: "Active" | "Fatal" | "Shortage";
  dateCreated: string;
  lastUpdated: string;
  updatedBy: string;
};

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

export const MOCK_DATA: Integration[] = [
  {
    id: "1",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Iwinosa Omoregie",
  },
  {
    id: "2",
    name: "Name of company",
    description: "Description",
    status: "Fatal",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Omotolani Babajide",
  },
  {
    id: "3",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Omotolani Babajide",
  },
  {
    id: "4",
    name: "Name of company",
    description: "Description",
    status: "Shortage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Iwinosa Omoregie",
  },
  {
    id: "5",
    name: "Name of company",
    description: "Description",
    status: "Shortage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Omotolani Babajide",
  },
  {
    id: "6",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Iwinosa Omoregie",
  },
  {
    id: "7",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Iwinosa Omoregie",
  },
  {
    id: "8",
    name: "Name of company",
    description: "Description",
    status: "Shortage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Omotolani Babajide",
  },
  {
    id: "9",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Iwinosa Omoregie",
  },
  {
    id: "10",
    name: "Name of company",
    description: "Description",
    status: "Active",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    updatedBy: "Omotolani Babajide",
  },
];

export const getBreadcrumbs = () => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Integrations", active: true },
];
