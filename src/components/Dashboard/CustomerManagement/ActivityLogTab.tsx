"use client";

import React from "react";
import Table, { Column } from "../Table";
import { FiFileText } from "react-icons/fi";

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={onClick}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

type ActivityLogItem = {
  id: string;
  action: string;
  dataPassed: string;
  column3: string;
  column4: string;
};

const ACTIVITY_LOG_DATA: ActivityLogItem[] = Array(6)
  .fill({
    id: "1",
    action: "Name of action carried out here",
    dataPassed: "What type of data should diplay here in a string",
    column3: "information written here",
    column4: "information written here",
  })
  .map((item, index) => ({ ...item, id: index.toString() }));

const columns: Column<ActivityLogItem>[] = [
  {
    header: "ACTION",
    className: "w-[25%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.action}</span>
    ),
  },
  {
    header: "DATA PASSED",
    className: "w-[35%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.dataPassed}
      </span>
    ),
  },
  {
    header: "ANOTHER COLUMN",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.column3}</span>
    ),
  },
  {
    header: "ANOTHER COLUMN",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.column4}</span>
    ),
  },
];

const ActivityLogTab: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard
          title="Download Table as PDF"
          actionText="Download"
          onClick={() => console.log("Download PDF")}
        />
        <ActionCard
          title="Export Table as CSV"
          actionText="Export"
          onClick={() => console.log("Export CSV")}
        />
      </div>
      <Table data={ACTIVITY_LOG_DATA} columns={columns} />
    </div>
  );
};

export default ActivityLogTab;
