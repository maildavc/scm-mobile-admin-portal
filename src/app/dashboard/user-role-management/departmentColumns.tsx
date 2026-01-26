"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type Department = {
  id: string;
  name: string;
  description: string;
  members: number;
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
  department,
  onEditDepartment,
  onViewDepartment,
}: {
  department: Department;
  onEditDepartment?: (department: Department) => void;
  onViewDepartment?: (department: Department) => void;
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
    { icon: FiEye, label: "View Department" },
    { icon: FiEdit3, label: "Edit Department" },
    { icon: FiTrash2, label: "Deactivate Department" },
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
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-xl text-xs font-bold text-[#B2171E] hover:bg-gray-200 transition-colors"
        >
          <HiMenu color="black" /> Options
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl z-50 py-2 min-w-50 border border-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.label === "Edit Department" && onEditDepartment) {
                    onEditDepartment(department);
                  } else if (
                    item.label === "View Department" &&
                    onViewDepartment
                  ) {
                    onViewDepartment(department);
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

export const departmentColumns: Column<Department>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all departments"
        />
        <span className="uppercase text-[#2F3140]">DEPARTMENT (5)</span>
      </div>
    ),
    className: "w-[30%]",
    render: (department) => (
      <div className="flex flex-col">
        <p className="font-bold text-[#2F3140] text-sm">{department.name}</p>
        <p className="text-[#707781] text-xs">{department.description}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>MEMBERS ASSIGNED</FilterableHeader>,
    className: "w-[20%]",
    render: (department) => (
      <span className="text-sm text-[#2F3140] font-bold">
        {department.members}
      </span>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (department) => <StatusBadge status={department.status} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[20%]",
    render: (department) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {department.updated}
      </span>
    ),
  },
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[15%]",
    render: (department) => <OptionsButton department={department} />,
  },
];

export const createDepartmentColumns = (
  onEditDepartment?: (department: Department) => void,
  onViewDepartment?: (department: Department) => void,
): Column<Department>[] => [
  ...departmentColumns.slice(0, 4),
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[15%]",
    render: (department) => (
      <OptionsButton
        department={department}
        onEditDepartment={onEditDepartment}
        onViewDepartment={onViewDepartment}
      />
    ),
  },
];
