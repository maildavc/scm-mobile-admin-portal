"use client";

import React from "react";

interface DocumentsTabProps {
  mode?: "view" | "approval";
}

const DocumentsTab: React.FC<DocumentsTabProps> = () => {
  return (
    <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 max-w-3xl min-h-120">
      <h3 className="text-base font-bold text-[#2F3140] mb-6">KYC Documents</h3>
      <div className="flex flex-col items-center justify-center py-12 text-[#707781] text-sm">
        <p>No customer documents were returned for this view.</p>
        <p className="mt-1 text-xs">
          KYC review actions are available from the KYC Verification module.
        </p>
      </div>
    </div>
  );
};

export default DocumentsTab;
