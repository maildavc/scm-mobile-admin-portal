"use client";

import React from "react";
import ActionButton from "@/components/Dashboard/ActionButton";
import Table, { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";

type APIStatusLog = {
  id: string;
  date: string;
  user: string;
  status: "Active" | "Fatal" | "Shortage" | "Failed";
  affected?: string;
};

const MOCK_LOGS: APIStatusLog[] = [
  {
    id: "1",
    date: "28/12/2025 13:32",
    user: "Iwinosa Omoregie",
    status: "Active",
  },
  {
    id: "2",
    date: "28/12/2025 13:32",
    user: "Omotolani Babajide",
    status: "Fatal",
    affected: "Unable to assign product to customers",
  },
  {
    id: "3",
    date: "28/12/2025 13:32",
    user: "Omotolani Babajide",
    status: "Active",
  },
  {
    id: "4",
    date: "28/12/2025 13:32",
    user: "Iwinosa Omoregie",
    status: "Shortage",
    affected: "Unable to assign product to customers",
  },
  {
    id: "5",
    date: "28/12/2025 13:32",
    user: "Omotolani Babajide",
    status: "Shortage",
    affected: "Unable to assign product to customers",
  },
];

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const columns: Column<APIStatusLog>[] = [
  {
    header: <FilterableHeader>DATE</FilterableHeader>,
    className: "w-[25%]",
    render: (item) => (
      <div>
        <p className="font-bold text-[#2F3140] text-sm">{item.date}</p>
        <p className="text-[#707781] text-xs">{item.user}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>API STATUS</FilterableHeader>,
    className: "w-[25%]",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    header: (
      <span className="text-xs text-[#2F3140] uppercase font-bold">
        AFFECTED
      </span>
    ),
    className: "w-[50%]",
    render: (item) => (
      <span className="text-sm text-[#2F3140] font-bold">
        {item.affected || ""}
      </span>
    ),
  },
];

const APIStatusLogTab = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <ActionButton
          label="Download Table as PDF"
          actionText="Download"
          onClick={() => console.log("Download PDF")}
          fullWidth
        />
        <ActionButton
          label="Export Table as CSV"
          actionText="Export"
          onClick={() => console.log("Export CSV")}
          fullWidth
        />
      </div>

      {/* Table */}
      <div>
        <Table data={MOCK_LOGS} columns={columns} itemsPerPage={10} />
      </div>
    </div>
  );
};

export default APIStatusLogTab;
