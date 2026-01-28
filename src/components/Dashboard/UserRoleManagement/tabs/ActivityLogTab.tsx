"use client";

import React from "react";
import ActionButton from "@/components/Dashboard/ActionButton";

const ActivityLogTab: React.FC = () => {
  const activityLogs = [
    {
      action: "Name of action carried out here",
      dataPassed: "What type of data should diplay here in a string",
      column3: "information written here",
      column4: "information written here",
    },
    {
      action: "Name of action carried out here",
      dataPassed: "What type of data should diplay here in a string",
      column3: "information written here",
      column4: "information written here",
    },
    {
      action: "Name of action carried out here",
      dataPassed: "What type of data should diplay here in a string",
      column3: "information written here",
      column4: "information written here",
    },
    {
      action: "Name of action carried out here",
      dataPassed: "What type of data should diplay here in a string",
      column3: "information written here",
      column4: "information written here",
    },
    {
      action: "Name of action carried out here",
      dataPassed: "What type of data should diplay here in a string",
      column3: "information written here",
      column4: "information written here",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-3 mb-6">
        <ActionButton
          onClick={() => console.log("Download clicked")}
          label="Download Table as PDF"
          actionText="Download"
          fullWidth
        />
        <ActionButton
          onClick={() => console.log("Export clicked")}
          label="Export Table as CSV"
          actionText="Export"
          fullWidth
        />
      </div>

      {/* Activity Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F4F4F5]">
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#2F3140] uppercase">
                ACTION
              </th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#2F3140] uppercase">
                DATA PASSED
              </th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#2F3140] uppercase">
                ANOTHER COLUMN
              </th>
              <th className="text-left py-4 px-4 text-xs font-semibold text-[#2F3140] uppercase">
                ANOTHER COLUMN
              </th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-[#F4F4F5] hover:bg-gray-50"
              >
                <td className="py-4 px-4 text-sm text-[#2F3140]">
                  {log.action}
                </td>
                <td className="py-4 px-4 text-sm text-[#707781]">
                  {log.dataPassed}
                </td>
                <td className="py-4 px-4 text-sm text-[#707781]">
                  {log.column3}
                </td>
                <td className="py-4 px-4 text-sm text-[#707781]">
                  {log.column4}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogTab;
