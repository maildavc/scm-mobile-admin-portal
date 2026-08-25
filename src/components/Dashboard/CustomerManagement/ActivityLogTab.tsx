"use client";

import React from "react";
import Table, { Column } from "../Table";
import { FiFileText } from "react-icons/fi";
import { runTableExportAction } from "@/components/Dashboard/ActionButton";
import { useCustomerActivityLogs } from "@/hooks/useCustomers";
import type { CustomerActivityLogDto } from "@/services/customerService";
import { formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick?: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={() => (onClick ? onClick() : runTableExportAction(title))}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

const columns: Column<CustomerActivityLogDto>[] = [
  {
    header: "ACTION",
    className: "w-[25%]",
    render: (item) => <span className="text-sm font-bold text-[#2F3140]">{item.action || "—"}</span>,
  },
  {
    header: "DESCRIPTION",
    className: "w-[35%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.description || "—"}</span>
    ),
  },
  {
    header: "PERFORMED BY",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.performedBy || "—"}</span>
    ),
  },
  {
    header: "DATE",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {formatDateTimeDdMmYyyy(item.performedAt)}
      </span>
    ),
  },
];

interface ActivityLogTabProps {
  customerId?: string;
}

const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ customerId }) => {
  const { data = [], isLoading, isError, error } = useCustomerActivityLogs(customerId);
  const errorMessage =
    (error as { response?: { data?: { message?: string; error?: string } }; message?: string })
      ?.response?.data?.message ||
    (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
    (error as { message?: string })?.message ||
    "Unable to load activity logs.";

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard title="Download Table as PDF" actionText="Download" />
        <ActionCard title="Export Table as CSV" actionText="Export" />
      </div>
      {isError ? (
        <p className="text-sm text-[#B2171E] mb-4">{errorMessage}</p>
      ) : null}
      <Table data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default ActivityLogTab;
