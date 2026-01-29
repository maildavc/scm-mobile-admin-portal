import { AuditLogItem } from "@/constants/auditLog/auditLog";
import { Column } from "@/components/Dashboard/Table";
import React from "react";

export const columns: Column<AuditLogItem>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all"
        />
        <span className="uppercase text-[#2F3140]">USER (5)</span>
      </div>
    ),
    className: "w-[25%]",
    render: (item) => (
      <div className="flex items-center gap-2">
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{item.user.name}</p>
          <p className="text-[#707781] text-xs">{item.user.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: "USER TYPE",
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {item.userType}
      </span>
    ),
  },
  {
    header: "ACTION",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">{item.action}</span>
    ),
  },
  {
    header: "DATA PASSED",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.dataPassed}
      </span>
    ),
  },
  {
    header: "ANOTHER COLUMN",
    className: "w-[10%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.anotherColumn}
      </span>
    ),
  },
  {
    header: "ANOTHER COLUMN",
    className: "w-[10%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.anotherColumn2}
      </span>
    ),
  },
];
