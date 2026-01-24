import React from "react";
import { BsFillExclamationCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";

type StatusType = "Active" | "Deactivated" | "Awaiting Approval" | "Completed";

interface StatusBadgeProps {
  status: StatusType;
  displayLabel?: string; // Optional override for the displayed text
}

const statusStyles: Record<
  StatusType,
  { bg: string; border: string; text: string }
> = {
  Active: {
    bg: "bg-[#E7F6EC]",
    border: "border-[#036B26]/10",
    text: "text-black",
  },
  Deactivated: {
    bg: "bg-[#EEEEEE]",
    border: "border-[#555555]/10",
    text: "text-black",
  },
  "Awaiting Approval": {
    bg: "bg-[#FEF6E7]",
    border: "border-[#865503]/10",
    text: "text-black",
  },
  Completed: {
    bg: "bg-[#E7F6EC]",
    border: "border-[#036B26]/10",
    text: "text-black",
  },
};

const getStatusIcon = (status: StatusType) => {
  switch (status) {
    case "Active":
      return <GoCheckCircleFill className="" size={14} color="#00A85A" />;
    case "Deactivated":
      return <BsPauseCircleFill className="" size={14} color="#A4A4A4" />;
    case "Awaiting Approval":
      return (
        <BsFillExclamationCircleFill className="" size={14} color="#E3A300" />
      );
    case "Completed":
      return <GoCheckCircleFill className="" size={14} color="#00A85A" />;
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  displayLabel,
}) => {
  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex border items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
    >
      {getStatusIcon(status)}
      {displayLabel || status}
    </span>
  );
};
