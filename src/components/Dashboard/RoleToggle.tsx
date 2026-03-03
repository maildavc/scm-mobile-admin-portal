"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";

/**
 * Displays the current user role as a read-only badge.
 * The role is determined by the backend login response:
 *   Admin → Approver (AP)
 *   Initiator/Manager → Initiator (IA)
 */
const RoleToggle: React.FC = () => {
  const isApprover = useAuthStore((s) => s.isApprover);
  const label = isApprover ? "Approver" : "Initiator";
  const shortLabel = isApprover ? "AP" : "IA";

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isApprover
            ? "bg-[#B2171E]/20 text-[#B2171E] border border-[#B2171E]/30"
            : "bg-[#2A2A2A] text-gray-300 border border-gray-600"
        }`}
      >
        <span className="md:hidden">{shortLabel}</span>
        <span className="hidden md:inline">{label}</span>
      </span>
    </div>
  );
};

export default RoleToggle;
