"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { TbFilterEdit } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

type FAQ = {
  id: string;
  title: string;
  description: string;
  author: string;
  dateCreated: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  status: "Active" | "Awaiting Approval";
  approverStatus: "Approved" | "Awaiting Approval";
};

export const createFAQColumns = (
  onViewFAQ?: (faq: FAQ) => void,
  isApprover?: boolean,
): Column<FAQ>[] => [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all FAQs"
        />
        <span className="uppercase text-[#2F3140]">FAQ (20)</span>
      </div>
    ),
    className: "w-[35%] whitespace-normal!",
    render: (faq) => (
      <div className="flex items-start gap-3">
        <div>
          <p className="font-bold text-[#2F3140] text-sm leading-tight line-clamp-2">
            {faq.title}
          </p>
          <p className="text-xs text-[#707781] mt-0.5 line-clamp-1">
            {faq.description}
          </p>
          <p className="text-[10px] text-[#707781] mt-1">{faq.author}</p>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>DATE CREATED</FilterableHeader>,
    className: "w-[15%] whitespace-normal!",
    render: (faq) => (
      <span className="text-sm text-[#2F3140] font-bold">{faq.dateCreated}</span>
    ),
  },
  {
    header: <FilterableHeader>LAST UPDATED</FilterableHeader>,
    className: "w-[15%] whitespace-normal!",
    render: (faq) => (
      <div className="flex flex-col">
        <span className="text-sm text-[#2F3140] font-bold">
          {faq.lastUpdated}
        </span>
        <span className="text-xs text-[#707781]">{faq.lastUpdatedBy}</span>
      </div>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[20%]",
    render: (faq) => {
      const displayStatus = isApprover ? faq.approverStatus : faq.status;
      return <StatusBadge status={displayStatus} />;
    },
  },
  {
    header: <span className="uppercase text-[#2F3140]">ACTION</span>,
    className: "w-[10%]",
    render: (faq) => (
      <OptionsButton faq={faq} isApprover={isApprover} onViewFAQ={onViewFAQ} />
    ),
  },
];

const OptionsButton = ({
  faq,
  isApprover,
  onViewFAQ,
}: {
  faq: FAQ;
  isApprover?: boolean;
  onViewFAQ?: (faq: FAQ) => void;
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

  const approverMenuItems = [
    {
      icon: FiEye,
      label: "View Request",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
    {
      icon: FiCheck,
      label: "Approve Request",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
    {
      icon: FiX,
      label: "Reject Request",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
  ];

  const initiatorMenuItems = [
    {
      icon: FiEye,
      label: "View FAQ",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
    {
      icon: FiCheck,
      label: "Edit FAQ",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
    {
      icon: FiX,
      label: "Delete FAQ Request",
      onClick: () => {
        setIsOpen(false);
        onViewFAQ?.(faq);
      },
    },
  ];

  const menuItems = isApprover ? approverMenuItems : initiatorMenuItems;

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
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-gray-200 transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-40 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
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
