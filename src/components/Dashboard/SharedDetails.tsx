import React from "react";

export const DetailCard = ({
  title,
  children,
  headerContent,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-xl p-4 border-[#F4F4F5] ${className}`}>
    <h3 className="text-sm font-semibold text-[#2F3140] mb-6">{title}</h3>
    {headerContent && (
      <div className="flex justify-center mb-6">{headerContent}</div>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

export const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
    <span className="text-sm text-[#2F3140]">{label}</span>
    <span className="text-sm text-[#707781]">{value}</span>
  </div>
);

export const DetailSubheading = ({ title }: { title: string }) => (
  <h4 className="text-sm font-semibold text-[#2F3140] mt-14 mb-4">{title}</h4>
);
