import { KYCRequest } from "@/constants/kycVerification/kycVerification";
import { Column } from "@/components/Dashboard/Table";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import Button from "@/components/Button";
import { HiMenu } from "react-icons/hi";
import React, { useState, useRef, useEffect } from "react";
import { FiEye } from "react-icons/fi";

const OptionsButton = ({
  request,
  onViewRequest,
}: {
  request: KYCRequest;
  onViewRequest: (request: KYCRequest) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-red-600 hover:text-white transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-50 border border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewRequest(request);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FiEye size={18} className="text-[#2F3140]" />
              <span className="text-sm text-[#2F3140] font-medium">View Request</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export const createColumns = (
  onViewRequest: (request: KYCRequest) => void,
  requestCount = 0,
): Column<KYCRequest>[] => {
  return [
    {
      header: (
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" aria-label="Select all" />
          <span className="uppercase text-[#2F3140]">KYC REQUESTS ({requestCount})</span>
        </div>
      ),
      className: "w-[25%]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="font-bold text-[#2F3140] text-sm">{item.customer.name}</p>
            <p className="text-[#707781] text-xs">{item.customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: <span className="uppercase text-xs text-[#2F3140]">Verification Type</span>,
      className: "w-[20%]",
      render: (item) => (
        <span className="text-sm font-bold text-[#2F3140]">{item.verificationType}</span>
      ),
    },
    {
      header: <span className="uppercase text-xs text-[#2F3140]">Status</span>,
      className: "w-[15%]",
      render: (item) => (
        <div className="flex">
          <StatusBadge status={item.status as StatusType} />
        </div>
      ),
    },
    {
      header: <span className="uppercase text-xs text-[#2F3140]">Initiated By</span>,
      className: "w-[20%]",
      render: (item) => (
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{item.initiatedBy.name}</p>
          <p className="text-[#707781] text-xs">{item.initiatedBy.email}</p>
        </div>
      ),
    },
    {
      header: <span className="uppercase text-xs text-[#2F3140]">Date Requested</span>,
      className: "w-[15%]",
      render: (item) => (
        <span className="text-sm font-bold text-[#2F3140]">{item.dateRequested}</span>
      ),
    },
    {
      header: (
        <div className="flex items-center gap-1">
          <span className="uppercase text-[#2F3140] text-xs">Action</span>
        </div>
      ),
      className: "w-[10%]",
      render: (item) => {
        const normalized = String(item.status || "").toLowerCase();
        const isTerminal =
          normalized.includes("completed") ||
          normalized.includes("approved") ||
          normalized.includes("rejected") ||
          normalized.includes("failed");

        if (isTerminal) {
          return (
            <Button
              text="View"
              variant="outline"
              className="text-[#B2171E]! px-2! text-xs! font-bold"
              onClick={() => onViewRequest(item)}
            />
          );
        }

        return <OptionsButton request={item} onViewRequest={onViewRequest} />;
      },
    },
  ];
};
