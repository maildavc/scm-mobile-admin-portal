import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { SidebarToggle } from "./Sidebar";

interface PageHeaderProps {
  title: string;
  breadcrumbs: {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <div className="w-full px-8 pt-8 pb-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-[#2F3140]">{title}</h2>
        <SidebarToggle />
      </div>
      <div className="flex items-center gap-2 text-xs text-[#707781]">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <FiChevronRight size={12} />}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                className="font-normal hover:text-[#2F3140] transition-colors"
                type="button"
              >
                {crumb.label}
              </button>
            ) : crumb.href ? (
              <Link
                href={crumb.href}
                className="font-normal hover:text-[#2F3140] transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-[#2F3140]">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;
