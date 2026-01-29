import { KYCRequest } from "@/constants/kycVerification/kycVerification";
import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import Button from "@/components/Button";
import { HiMenu } from "react-icons/hi";
import { TbFilterEdit } from "react-icons/tb";
import React, { useState, useRef, useEffect } from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

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

  const menuItems = [
    { icon: FiEye, label: "View Request" },
    { icon: FiCheck, label: "Approve Request" },
    { icon: FiX, label: "Reject Request" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-red-600 hover:text-white transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-50 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  onViewRequest(request);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <item.icon size={18} className="text-[#2F3140]" />
                <span className="text-sm text-[#2F3140] font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const createColumns = (
  isApprover: boolean,
  onViewRequest?: (request: KYCRequest) => void,
): Column<KYCRequest>[] => {
  const baseColumns: Column<KYCRequest>[] = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            aria-label="Select all"
          />
          <span className="uppercase text-[#2F3140]">CUSTOMER (5)</span>
        </div>
      ),
      className: "w-[25%]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="font-bold text-[#2F3140] text-sm">
              {item.customer.name}
            </p>
            <p className="text-[#707781] text-xs">{item.customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: <FilterableHeader>VERIFICATION TYPE</FilterableHeader>,
      className: "w-[20%]",
      render: (item) => (
        <span className="text-sm font-bold text-[#2F3140]">
          {item.verificationType}
        </span>
      ),
    },
    {
      header: <FilterableHeader>STATUS</FilterableHeader>,
      className: "w-[15%]",
      render: (item) => (
        <div className="flex">
          <StatusBadge status={item.status} />
        </div>
      ),
    },
    {
      header: <FilterableHeader>INITIATED BY</FilterableHeader>,
      className: "w-[20%]",
      render: (item) => (
        <div>
          <p className="font-bold text-[#2F3140] text-sm">
            {item.initiatedBy.name}
          </p>
          <p className="text-[#707781] text-xs">{item.initiatedBy.email}</p>
        </div>
      ),
    },
    {
      header: <FilterableHeader>DATE REQUESTED</FilterableHeader>,
      className: "w-[15%]",
      render: (item) => (
        <span className="text-sm font-bold text-[#2F3140]">
          {item.dateRequested}
        </span>
      ),
    },
  ];

  if (isApprover) {
    baseColumns.push({
      header: (
        <div className="flex items-center gap-1">
          <span className="uppercase text-[#2F3140] text-xs">ACTION</span>
        </div>
      ),
      className: "w-[10%]",
      render: (item) => {
        if (item.status === "Completed") {
          return (
            <Button
              text="View"
              variant="outline"
              className="text-[#B2171E]! px-2! text-xs! font-bold"
              onClick={() => onViewRequest && onViewRequest(item)}
            />
          );
        }
        return (
          <OptionsButton
            request={item}
            onViewRequest={onViewRequest || (() => {})}
          />
        );
      },
    });
  }

  return baseColumns;
};
