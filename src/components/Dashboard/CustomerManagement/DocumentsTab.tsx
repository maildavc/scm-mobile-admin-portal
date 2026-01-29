"use client";

import React from "react";
import Button from "../../Button";

interface Document {
  id: string;
  type: string;
  name: string;
  addedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const DOCUMENTS: Document[] = [
  {
    id: "1",
    type: "Document File",
    name: "Signature",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Pending",
  },
  {
    id: "2",
    type: "Document File",
    name: "Utility Bill",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Approved",
  },
  {
    id: "3",
    type: "Document File",
    name: "Other Document",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Rejected",
  },
];

interface DocumentsTabProps {
  mode?: "view" | "approval";
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ mode = "view" }) => {
  const handleViewFile = (docId: string) => {
    console.log("View file:", docId);
  };

  const handleDelete = (docId: string) => {
    console.log("Delete file:", docId);
  };

  const handleApprove = (docId: string) => {
    console.log("Approve file:", docId);
  };

  const handleReject = (docId: string) => {
    console.log("Reject file:", docId);
  };

  return (
    <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 max-w-3xl min-h-120">
      <h3 className="text-base font-bold text-[#2F3140] mb-6">KYC Documents</h3>

      <div className="flex flex-col gap-4">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#707781]">{doc.type}</p>
              <p className="text-sm font-bold text-[#2F3140]">{doc.name}</p>
              <p className="text-xs text-[#707781]">Added: {doc.addedDate}</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Button
                text="View File"
                variant="primary"
                onClick={() => handleViewFile(doc.id)}
                className="w-auto! px-6! py-2! font-semibold text-sm md:text-base bg-[#F4F4F5]! text-[#2F3140]! border-none!"
              />

              {mode === "view" && (
                <Button
                  text="Delete"
                  variant="outline"
                  onClick={() => handleDelete(doc.id)}
                  className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                />
              )}

              {mode === "approval" && doc.status === "Pending" && (
                <>
                  <Button
                    text="Reject"
                    variant="outline"
                    onClick={() => handleReject(doc.id)}
                    className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                  />
                  <Button
                    text="Approve"
                    variant="outline"
                    onClick={() => handleApprove(doc.id)}
                    className="w-auto! px-6! py-2! text-[#036B26]! font-semibold text-sm md:text-base"
                  />
                </>
              )}

              {mode === "approval" && doc.status === "Approved" && (
                <Button
                    text="Approved"
                    variant="outline"
                    onClick={() => handleApprove(doc.id)}
                    className="w-auto! px-6! py-2! text-[#036B26]! font-semibold text-sm md:text-base"
                  />
              )}

              {mode === "approval" && doc.status === "Rejected" && (
                <Button
                    text="Rejected"
                    variant="outline"
                    onClick={() => handleApprove(doc.id)}
                    className="w-auto! px-6! py-2! text-[#B2171E]! font-semibold text-sm md:text-base"
                  />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;
