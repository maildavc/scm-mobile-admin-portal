import React from "react";
import { FiFile } from "react-icons/fi";
import { FaArrowUp } from "react-icons/fa";

interface StatsCardProps {
  label: string;
  value: string | number;
  linkText?: string;
  linkHref?: string;
  className?: string;
  showLink?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  linkText = "Manage Profile",
  linkHref = "#",
  className = "",
  showLink = true,
}) => {
  return (
    <div className={`border border-gray-100 rounded-xl p-3 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#2F3140] mb-4">
        <FiFile size={16} />
      </div>
      <p className="text-[#707781] text-xs font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-[#2F3140] mb-1">{value}</h3>
      {showLink && (
        <a
          href={linkHref}
          className="text-[#1F9F66] text-xs font-medium flex items-center gap-1"
        >
          {linkText} <FaArrowUp color="#2F3140" size={10} />
        </a>
      )}
    </div>
  );
};

export default StatsCard;
