"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";

const RoleToggle: React.FC = () => {
  const { isApprover, toggleRole } = useRole();

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span
        className={`text-xs font-medium transition-colors ${
          !isApprover ? "text-white" : "text-gray-500"
        }`}
      >
        <span className="md:hidden">IA</span>
        <span className="hidden md:inline">Initiator</span>
      </span>

      <button
        onClick={toggleRole}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${
          isApprover ? "bg-[#B2171E]" : "bg-[#2A2A2A] border border-gray-600"
        }`}
        aria-label={`Switch to ${isApprover ? "Initiator" : "Approver"} role`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
            isApprover ? "left-7" : "left-1"
          }`}
        />
      </button>

      <span
        className={`text-xs font-medium transition-colors ${
          isApprover ? "text-white" : "text-gray-500"
        }`}
      >
        <span className="md:hidden">AP</span>
        <span className="hidden md:inline">Approver</span>
      </span>
    </div>
  );
};

export default RoleToggle;
