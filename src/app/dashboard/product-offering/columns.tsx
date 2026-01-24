"use client";

import { Column } from "@/components/Dashboard/Table";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { FiEye, FiEdit3, FiCheck, FiTrash2, FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
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
  product,
  onEditProduct,
  onViewProduct,
  isApprover,
}: {
  product: Product;
  onEditProduct?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  isApprover?: boolean;
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

  // Different menu items based on role
  const initiatorMenuItems = [
    { icon: FiEye, label: "View Product" },
    { icon: FiEdit3, label: "Edit Product" },
    { icon: FiCheck, label: "Approve Request" },
    { icon: FiTrash2, label: "Deactivate Product" },
  ];

  const approverMenuItems = [
    { icon: FiEye, label: "View Request" },
    { icon: FiCheck, label: "Approve Request" },
    { icon: FiX, label: "Reject Request" },
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
                  if (item.label === "Edit Product" && onEditProduct) {
                    onEditProduct(product);
                  } else if (
                    (item.label === "View Product" ||
                      item.label === "View Request" ||
                      item.label === "Approve Request") &&
                    onViewProduct
                  ) {
                    onViewProduct(product);
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

export const productColumns: Column<Product>[] = [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all products"
        />
        <span className="uppercase text-[#2F3140]">PRODUCT (5)</span>
      </div>
    ),
    className: "w-[20%]",
    render: (product) => (
      <div>
        <p className="font-bold text-[#2F3140] text-sm">{product.name}</p>
        <p className="text-[#707781] text-xs">{product.id}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>PRODUCT TYPE</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">{product.type}</span>
    ),
  },
  {
    header: <FilterableHeader>PORTFOLIO SIZE</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-bold">{product.size}</span>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => <StatusBadge status={product.status} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {product.updated}
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
    render: (product) => <OptionsButton product={product} />,
  },
];

export const createProductColumns = (
  onEditProduct?: (product: Product) => void,
  onViewProduct?: (product: Product) => void,
  isApprover?: boolean,
): Column<Product>[] => [
  {
    header: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          aria-label="Select all products"
        />
        <span className="uppercase text-[#2F3140]">PRODUCT (5)</span>
      </div>
    ),
    className: "w-[20%]",
    render: (product) => (
      <div>
        <p className="font-bold text-[#2F3140] text-sm">{product.name}</p>
        <p className="text-[#707781] text-xs">{product.id}</p>
      </div>
    ),
  },
  {
    header: <FilterableHeader>PRODUCT TYPE</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">{product.type}</span>
    ),
  },
  {
    header: <FilterableHeader>PORTFOLIO SIZE</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-bold">{product.size}</span>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <StatusBadge
        status={product.status}
        displayLabel={
          isApprover && product.status === "Active" ? "Approved" : undefined
        }
      />
    ),
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {product.updated}
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
    render: (product) => (
      <OptionsButton
        product={product}
        onEditProduct={onEditProduct}
        onViewProduct={onViewProduct}
        isApprover={isApprover}
      />
    ),
  },
];
