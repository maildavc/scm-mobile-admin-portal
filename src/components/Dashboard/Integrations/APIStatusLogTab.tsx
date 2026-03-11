import React from "react";
import ActionButton from "@/components/Dashboard/ActionButton";
import Table, { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { useIntegrationLogs } from "@/hooks/useIntegration";
import { IntegrationLogDto } from "@/types/integration";

interface APIStatusLogTabProps {
  integrationId: string;
}

// Removed mock logs

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const columns: Column<IntegrationLogDto>[] = [
  {
    header: <FilterableHeader>DATE</FilterableHeader>,
    className: "w-[25%]",
    render: (item) => (
      <div>
        <p className="font-bold text-[#2F3140] text-sm">{new Date(item.timestamp).toLocaleDateString("en-GB") + " " + new Date(item.timestamp).toLocaleTimeString("en-GB", { hour:'2-digit', minute:'2-digit' })}</p>
        <p className="text-[#707781] text-xs">{item.performedBy || "System"}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>API STATUS</FilterableHeader>,
    className: "w-[25%]",
    render: (item) => <StatusBadge status={(item.logLevel === "Error" || item.logLevel === "Critical" ? "Fatal" : item.logLevel === "Warning" ? "Shortage" : "Active") as "Active" | "Fatal" | "Shortage" | "Failed"} displayLabel={item.logLevel || "Info"} />,
  },
  {
    header: (
      <span className="text-xs text-[#2F3140] uppercase font-bold">
        DETAILS
      </span>
    ),
    className: "w-[50%]",
    render: (item) => (
      <span className="text-sm text-[#2F3140] font-bold">
        {item.details || item.action || ""}
      </span>
    ),
  },
];

const APIStatusLogTab: React.FC<APIStatusLogTabProps> = ({ integrationId }) => {
  const itemsPerPage = 10;
  
  const { data: logsResponse } = useIntegrationLogs(integrationId, {
    Page: 1,
    PageSize: itemsPerPage,
  });

  const logs = logsResponse?.items || [];

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

      {/* Table - ignoring pagination controls since Table doesn't seem to have totalItems natively yet, or we'll fix it if we check Table.tsx soon */}
      <div>
        <Table data={logs} columns={columns} itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};

export default APIStatusLogTab;
