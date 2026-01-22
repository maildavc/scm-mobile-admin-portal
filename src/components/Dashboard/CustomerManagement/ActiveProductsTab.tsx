"use client";

import React from "react";
import Table from "../Table";
import { Column } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { ACTIVE_PRODUCTS, Product } from "@/constants/customerManagement/activeProducts";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const productColumns: Column<Product>[] = [
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
    className: "w-[25%]",
    render: (product) => (
      <div className="flex items-center gap-3">
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{product.name}</p>
          <p className="text-[#707781] text-xs">{product.code}</p>
        </div>
      </div>
    ),
  },
  {
    header: <FilterableHeader>PRODUCT TYPE</FilterableHeader>,
    className: "w-[20%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {product.productType}
      </span>
    ),
  },
  {
    header: <FilterableHeader>PORTFOLIO SIZE</FilterableHeader>,
    className: "w-[20%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {product.portfolioSize}
      </span>
    ),
  },
  {
    header: <FilterableHeader>STATUS</FilterableHeader>,
    className: "w-[20%]",
    render: (product) => <StatusBadge status={product.status} />,
  },
  {
    header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
    className: "w-[15%]",
    render: (product) => (
      <span className="text-sm text-[#2F3140] font-medium">
        {product.lastUpdated}
      </span>
    ),
  },
];

const ActiveProductsTab: React.FC = () => {
  return (
    <div>
      <Table data={ACTIVE_PRODUCTS} columns={productColumns} />
    </div>
  );
};

export default ActiveProductsTab;
