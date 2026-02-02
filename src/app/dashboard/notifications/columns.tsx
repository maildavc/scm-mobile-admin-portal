"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

type Notification = {
  id: string;
  name: string;
  audience: string;
  channel: string;
  type: string;
  status:
    | "Sent"
    | "Sending"
    | "Draft"
    | "Failed"
    | "Awaiting Approval"
    | "Approved";
  approverStatus:
    | "Sent"
    | "Sending"
    | "Draft"
    | "Failed"
    | "Awaiting Approval"
    | "Approved";
  sent: number;
  delivered: number;
  dateCreated: string;
};

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const OptionsButton = ({
  notification,
  isApprover,
  onViewRequest,
  onApproveRequest,
  onRejectRequest,
}: {
  notification: Notification;
  isApprover?: boolean;
  onViewRequest?: (notification: Notification) => void;
  onApproveRequest?: (notification: Notification) => void;
  onRejectRequest?: (notification: Notification) => void;
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
        onViewRequest?.(notification);
      }
    },
    { 
      icon: FiCheck, 
      label: "Approve Request",
      onClick: () => {
        setIsOpen(false);
        onApproveRequest?.(notification);
      }
    },
    { 
      icon: FiX, 
      label: "Reject Request",
      onClick: () => {
        setIsOpen(false);
        onRejectRequest?.(notification);
      }
    },
  ];

  const menuItems = isApprover ? approverMenuItems : [];

  if (!isApprover) return null;

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

export const createNotificationColumns = (
  isApprover?: boolean,
  onViewRequest?: (notification: Notification) => void,
): Column<Notification>[] => {
  const commonColumns: Column<Notification>[] = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            aria-label="Select all notifications"
          />
          <span className="uppercase text-[#2F3140]">NOTIFICATION (5)</span>
        </div>
      ),
      className: "w-[25%]",
      render: (notification) => (
        <span className="font-bold text-[#2F3140] text-sm">
          {notification.name}
        </span>
      ),
    },
    {
      header: <FilterableHeader>AUDIENCE</FilterableHeader>,
      className: "w-[15%]",
      render: (notification) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {notification.audience}
        </span>
      ),
    },
    {
      header: <FilterableHeader>CHANNEL</FilterableHeader>,
      className: "w-[10%]",
      render: (notification) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {notification.channel}
        </span>
      ),
    },
    {
      header: <FilterableHeader>TYPE</FilterableHeader>,
      className: "w-[10%]",
      render: (notification) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {notification.type}
        </span>
      ),
    },
  ];

  if (isApprover) {
    return [
      ...commonColumns,
      {
        header: <FilterableHeader>DATE CREATED</FilterableHeader>,
        className: "w-[15%]",
        render: (notification) => (
          <span className="text-sm text-[#2F3140] font-medium">
            {notification.dateCreated}
          </span>
        ),
      },
      {
        header: <FilterableHeader>STATUS</FilterableHeader>,
        className: "w-[15%]",
        render: (notification) => <StatusBadge status={notification.approverStatus} />,
      },
      {
        header: <div className="text-xs text-[#2F3140] uppercase">ACTION</div>,
        className: "w-[10%]",
        render: (notification) => (
          <OptionsButton 
            notification={notification} 
            isApprover={isApprover}
            onViewRequest={onViewRequest}
            onApproveRequest={onViewRequest}
            onRejectRequest={onViewRequest}
          />
        ),
      },
    ];
  }

  // Initiator Columns
  return [
    ...commonColumns,
    {
      header: <FilterableHeader>STATUS</FilterableHeader>,
      className: "w-[15%]",
      render: (notification) => <StatusBadge status={notification.status} />,
    },
    {
      header: <div className="text-xs text-[#2F3140] uppercase">SENT</div>,
      className: "w-[10%]",
      render: (notification) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {notification.sent}
        </span>
      ),
    },
    {
      header: <div className="text-xs text-[#2F3140] uppercase">DELIVERED</div>,
      className: "w-[10%]",
      render: (notification) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {notification.delivered}
        </span>
      ),
    },
  ];
};
