"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiEdit3, FiUser, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  roleName: string;
  roleType: string;
  roleExpiry?: string;
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
  user,
  onEditUser,
  onViewUser,
}: {
  user: User;
  onEditUser?: (user: User) => void;
  onViewUser?: (user: User) => void;
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
    { icon: FiEye, label: "View User" },
    { icon: FiEdit3, label: "Edit User" },
    { icon: FiTrash2, label: "Deactivate User" },
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
                  if (item.label === "Edit User" && onEditUser) {
                    onEditUser(user);
                  } else if (item.label === "View User" && onViewUser) {
                    onViewUser(user);
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

export const userColumns: Column<User>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all users"
        />
        <span className="uppercase text-[#2F3140]">USER (5)</span>
      </div>
    ),
    className: "w-[25%]",
    render: (user) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center text-white">
            <FiUser size={20} color="#2F3140" />
          </div>
          <div>
            <p className="font-bold text-[#2F3140] text-sm">{user.name}</p>
            <p className="text-[#707781] text-xs">{user.email}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>ROLE NAME</FilterableHeader>,
    className: "w-[15%]",
    render: (user) => (
      <span className="text-sm text-[#2F3140] font-bold">{user.roleName}</span>
    ),
  },
  {
    header: <FilterableHeader>ROLE TYPE</FilterableHeader>,
    className: "w-[15%]",
    render: (user) => (
      <div className="flex flex-col">
        <span className="text-sm text-[#2F3140] font-bold">
          {user.roleType}
        </span>
        {user.roleExpiry && (
          <span className="text-xs text-[#707781]">{user.roleExpiry}</span>
        )}
      </div>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (user) => <StatusBadge status={user.status} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[20%]",
    render: (user) => (
      <span className="text-sm text-[#2F3140] font-medium">{user.updated}</span>
    ),
  },
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (user) => <OptionsButton user={user} />,
  },
];

export const createUserColumns = (
  onEditUser?: (user: User) => void,
  onViewUser?: (user: User) => void,
): Column<User>[] => [
  ...userColumns.slice(0, 5),
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (user) => (
      <OptionsButton
        user={user}
        onEditUser={onEditUser}
        onViewUser={onViewUser}
      />
    ),
  },
];
