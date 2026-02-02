import { FiHome, FiEdit, FiHelpCircle } from "react-icons/fi";

export const BLOG_SIDEBAR_ITEMS = [
  {
    icon: FiHome,
    label: "Overview",
    href: "/dashboard/blog-and-faqs",
  },
  {
    icon: FiEdit,
    label: "Create Blog Post",
    href: "/dashboard/blog-and-faqs/create-blog",
  },
  {
    icon: FiHelpCircle,
    label: "Create FAQ",
    href: "/dashboard/blog-and-faqs/create-faq",
  },
];

export const BLOG_STATS_CONFIG = [
  {
    label: "All Blogs",
    value: "500",
  },
  {
    label: "Homepage Blogs",
    value: "20",
  },
  {
    label: "Product Blogs",
    value: "20",
  },
];

export const PAGE_CONFIG = {
  title: "Blog & FAQs",
  itemsPerPage: 8,
};

export const BLOG_POSTS = [
  {
    id: "1",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Iwinosa Omoregie",
    status: "Active" as const,
    image: "/scmassetLogo.svg", // Using a placeholder that exists in public
  },
  {
    id: "2",
    title: "Blog title in one line",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Homepage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Omotolani Babajide",
    status: "Awaiting Approval" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "3",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Product Page",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Omotolani Babajide",
    status: "Active" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "4",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Iwinosa Omoregie",
    status: "Awaiting Approval" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "5",
    title: "Blog title in one line",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Omotolani Babajide",
    status: "Awaiting Approval" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "6",
    title: "Blog title in one line",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Homepage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Iwinosa Omoregie",
    status: "Active" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "7",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "SCM Admin",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Iwinosa Omoregie",
    status: "Active" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "8",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "SCM Admin",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Omotolani Babajide",
    status: "Awaiting Approval" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "9",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Homepage",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Iwinosa Omoregie",
    status: "Active" as const,
    image: "/scmassetLogo.svg",
  },
  {
    id: "10",
    title: "Blog title here in two lines maximum, if more extend the...",
    description: "One line description of the blo...",
    author: "Iwinosa Omoregie",
    audience: "Blog Section",
    dateCreated: "28/12/2025 13:32",
    lastUpdated: "28/12/2025 13:32",
    lastUpdatedBy: "Omotolani Babajide",
    status: "Active" as const,
    image: "/scmassetLogo.svg",
  },
];

export const FAQS = [
    {
        id: "1",
        question: "How do I create an account?",
        answer: "To create an account, click on the Sign Up button...",
        category: "Account",
        dateCreated: "28/12/2025 13:32",
        status: "Active" as const,
    },
    // Add more mock data as needed
];

export const getBreadcrumbs = (currentView: string) => [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog & FAQs", href: "/dashboard/blog-and-faqs" },
  ...(currentView !== "Overview" ? [{ label: currentView }] : []),
];
