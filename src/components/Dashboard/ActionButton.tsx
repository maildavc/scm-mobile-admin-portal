"use client";

import React from "react";
import { FiFile } from "react-icons/fi";
import Button from "@/components/Button";

interface ActionButtonProps {
  onClick?: () => void;
  label: string;
  actionText: string;
  fullWidth?: boolean;
}

export function runTableExportAction(label: string) {
  if (label.toLowerCase().includes("pdf")) {
    window.print();
    return;
  }

  const table = document.querySelector("table");
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
    Array.from(row.querySelectorAll("th,td")).map(
      (cell) => `"${(cell.textContent || "").trim().replaceAll('"', '""')}"`,
    ),
  );
  const csv = rows.map((row) => row.join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `scm-export-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  actionText,
  fullWidth = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    runTableExportAction(label);
  };

  return (
    <div
      className={`flex items-center gap-4 px-3 py-4 bg-white border border-gray-100 rounded-2xl ${fullWidth ? "flex-1" : ""}`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-[#F4F4F5] rounded-full">
        <FiFile size={20} color="#2F3140" />
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm text-[#707781] font-medium">{label}</span>
        <Button
          onClick={handleClick}
          text={actionText}
          variant="outline"
          className="py-1.5! px-2! w-auto! rounded-lg! text-[#B2171E]! font-bold text-sm"
        />
      </div>
    </div>
  );
};

export default ActionButton;
