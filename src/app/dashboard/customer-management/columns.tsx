"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiEdit3, FiUser, FiCheck, FiTrash2, FiBox } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type Customer = {
  id: string;
  name: string;
  tier: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  kycStatus: "Awaiting Approval" | "Completed";
  updated: string;
};

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const OptionsButton = ({
  customer,
  onEditCustomer,
  onViewCustomer,
}: {
  customer: Customer;
  onEditCustomer?: (customer: Customer) => void;
  onViewCustomer?: (customer: Customer) => void;
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
    { icon: FiEye, label: "View Customer" },
    { icon: FiEdit3, label: "Edit Customer" },
    { icon: FiBox, label: "Assign Product" },
    { icon: FiCheck, label: "Approve Request" },
    { icon: FiTrash2, label: "Deactivate Customer" },
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
                  if (item.label === "Edit Customer" && onEditCustomer) {
                    onEditCustomer(customer);
                  } else if (item.label === "View Customer" && onViewCustomer) {
                    onViewCustomer(customer);
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

export const customerColumns: Column<Customer>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all customers"
        />
        <span className="uppercase text-[#2F3140]">CUSTOMERS (5)</span>
      </div>
    ),
    className: "w-[20%]",
    render: (customer) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center text-white">
            <FiUser size={20} color="#2F3140" />
          </div>
          <div>
            <p className="font-bold text-[#2F3140] text-sm">{customer.name}</p>
            <p className="text-[#707781] text-xs">{customer.tier}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (customer) => <StatusBadge status={customer.status} />,
  },
  {
    header: <FilterableHeader>KYC STATUS</FilterableHeader>,
    className: "w-[20%]",
    render: (customer) => <StatusBadge status={customer.kycStatus} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[20%]",
    render: (customer) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {customer.updated}
      </span>
    ),
  },
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (customer) => <OptionsButton customer={customer} />,
  },
];

export const createCustomerColumns = (
  onEditCustomer?: (customer: Customer) => void,
  onViewCustomer?: (customer: Customer) => void,
): Column<Customer>[] => [
  ...customerColumns.slice(0, 4),
  {
    header: (
      <div className="flex items-center gap-1">
        <span className="uppercase">ACTION</span>
      </div>
    ),
    className: "w-[10%]",
    render: (customer) => (
      <OptionsButton
        customer={customer}
        onEditCustomer={onEditCustomer}
        onViewCustomer={onViewCustomer}
      />
    ),
  },
];
