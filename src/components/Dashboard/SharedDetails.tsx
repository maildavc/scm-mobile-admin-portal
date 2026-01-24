import React from "react";

export const DetailCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border rounded-xl p-4 border-[#F4F4F5]">
    <h3 className="text-sm font-semibold text-[#2F3140] mb-6">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
    <span className="text-sm text-[#2F3140]">{label}</span>
    <span className="text-sm text-[#707781]">{value}</span>
  </div>
);
