"use client";

import React from "react";
import Table from "../Table";
import { Column } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { TbFilterEdit } from "react-icons/tb";
import { FiFileText } from "react-icons/fi";
import {
  ACTIVE_PRODUCTS,
  Product,
} from "@/constants/customerManagement/activeProducts";

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const getProductColumns = (mode: "view" | "approval"): Column<Product>[] => {
  const columns: Column<Product>[] = [
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
      className: "w-[15%]",
      render: (product) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {product.productType}
        </span>
      ),
    },
    {
      header: <FilterableHeader>PORTFOLIO SIZE</FilterableHeader>,
      className: "w-[15%]",
      render: (product) => (
        <span className="text-sm text-[#2F3140] font-medium">
          {product.portfolioSize}
        </span>
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
          {product.lastUpdated}
        </span>
      ),
    },
  ];

  if (mode === "approval") {
    columns.push({
      header: "CHANGES",
      className: "w-[15%]",
      render: (product) =>
        product.changes ? (
          <span className="px-3 py-1 bg-[#FDE4E5] text-[#B2171E] rounded-full text-xs font-semibold">
            {product.changes}
          </span>
        ) : null,
    });
  }

  return columns;
};

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={onClick}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

interface ActiveProductsTabProps {
  mode?: "view" | "approval";
}

const ActiveProductsTab: React.FC<ActiveProductsTabProps> = ({
  mode = "view",
}) => {
  const columns = React.useMemo(() => getProductColumns(mode), [mode]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard
          title="Download Table as PDF"
          actionText="Download"
          onClick={() => console.log("Download PDF")}
        />
        <ActionCard
          title="Export Table as CSV"
          actionText="Export"
          onClick={() => console.log("Export CSV")}
        />
      </div>
      <Table data={ACTIVE_PRODUCTS} columns={columns} />
    </div>
  );
};

export default ActiveProductsTab;
