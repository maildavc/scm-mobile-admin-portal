"use client";

import React from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface CustomerServicePageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  children?: React.ReactNode;
}

const CustomerServicePageHeader: React.FC<CustomerServicePageHeaderProps> = ({
  title,
  breadcrumbs,
  children,
}) => {
  const router = useRouter();

  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-[#B2171E] text-white p-8 pb-16">
      <div className="flex justify-between items-start mb-8">
        {/* Breadcrumbs / Title */}
        <div>
          <h1 className="text-base font-bold mb-1">{title}</h1>
          <div className="text-xs opacity-80 flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>›</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close customer support"
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Optional Children Content (e.g. Welcome message) */}
      {children && <div className="mt-16">{children}</div>}
    </div>
  );
};

export default CustomerServicePageHeader;
