import { Column } from "@/components/Dashboard/Table";
import React from "react";
import type { AuditLogDto } from "@/types/auditLog";

export const columns: Column<AuditLogDto>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all"
        />
        <span className="uppercase text-[#2F3140]">USER</span>
      </div>
    ),
    className: "w-[20%]",
    render: (item) => (
      <div className="flex items-center gap-2">
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{item.userId || "System"}</p>
        </div>
      </div>
    ),
  },
  {
    header: "EVENT TYPE",
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {item.eventType || "-"}
      </span>
    ),
  },
  {
    header: "ACTION",
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.action || "-"}
      </span>
    ),
  },
  {
    header: "IP ADDRESS",
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.ipAddress || "-"}
      </span>
    ),
  },
  {
    header: "STATUS",
    className: "w-[15%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {item.status || "-"}
      </span>
    ),
  },
  {
    header: "DATE",
    className: "w-[20%]",
    render: (item) => (
      <span className="text-sm font-bold text-[#2F3140]">
        {new Date(item.createdAtUtc).toLocaleString()}
      </span>
    ),
  },
];
