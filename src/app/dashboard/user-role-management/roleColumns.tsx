"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type Role = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const OptionsButton = ({
  role,
  onEditRole,
  onViewRole,
}: {
  role: Role;
  onEditRole?: (role: Role) => void;
  onViewRole?: (role: Role) => void;
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
    { icon: FiEye, label: "View Role" },
    { icon: FiEdit3, label: "Edit Role" },
    { icon: FiTrash2, label: "Deactivate Role" },
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
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#2F3140] hover:bg-gray-200 transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-50 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.label === "Edit Role" && onEditRole) {
                    onEditRole(role);
                  } else if (item.label === "View Role" && onViewRole) {
                    onViewRole(role);
                  }
                  setIsOpen(false);
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

export const roleColumns: Column<Role>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all roles"
        />
        <span className="uppercase text-[#2F3140]">ROLES (5)</span>
      </div>
    ),
    className: "w-[25%]",
    render: (role) => (
      <div className="flex flex-col">
        <p className="font-bold text-[#2F3140] text-sm">{role.name}</p>
        <p className="text-[#707781] text-xs">{role.description}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[20%]",
    render: (role) => <StatusBadge status={role.status} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[20%]",
    render: (role) => (
      <span className="text-sm text-[#2F3140] font-medium">{role.updated}</span>
    ),
  },
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (role) => <OptionsButton role={role} />,
  },
];

export const createRoleColumns = (
  onEditRole?: (role: Role) => void,
  onViewRole?: (role: Role) => void,
): Column<Role>[] => [
  ...roleColumns.slice(0, 3),
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (role) => (
      <OptionsButton
        role={role}
        onEditRole={onEditRole}
        onViewRole={onViewRole}
      />
    ),
  },
];
