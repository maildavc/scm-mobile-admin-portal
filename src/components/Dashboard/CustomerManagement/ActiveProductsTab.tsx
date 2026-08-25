"use client";

import React, { useMemo } from "react";
import Table from "../Table";
import { Column } from "../Table";
import { StatusBadge } from "../StatusBadge";
import { FiFileText } from "react-icons/fi";
import { TbFilterEdit } from "react-icons/tb";
import { runTableExportAction } from "@/components/Dashboard/ActionButton";
import { useProducts } from "@/hooks/useProducts";
import type { CustomerProductAssignmentPayload } from "@/types/customer";
import { formatCompactAmount } from "@/utils/numberFormat";
import { formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";

type AssignedProduct = {
  id: string;
  name: string;
  code: string;
  productType: string;
  portfolioSize: string;
  status: string;
  lastUpdated: string;
  changes?: string;
};

const FilterableHeader = ({ children }: { children: string }) => (
  <div className="flex text-xs text-[#2F3140] items-center gap-2">
    <span className="uppercase">{children}</span>
    <TbFilterEdit size={18} color="#2F3140" />
  </div>
);

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick?: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={() => (onClick ? onClick() : runTableExportAction(title))}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

interface ActiveProductsTabProps {
  assignments?: CustomerProductAssignmentPayload[];
  mode?: "view" | "approval";
}

const ActiveProductsTab: React.FC<ActiveProductsTabProps> = ({
  assignments = [],
  mode = "view",
}) => {
  const { data: productsRes, isLoading } = useProducts({ page: 1, limit: 1000 });
  const catalog = productsRes?.value?.data?.products ?? [];

  const rows: AssignedProduct[] = useMemo(() => {
    return assignments.map((assignment) => {
      const product = catalog.find((item) => item.id === assignment.productId);
      const permissions = [
        assignment.canBuy ? "Buy" : null,
        assignment.canSell ? "Sell" : null,
      ]
        .filter(Boolean)
        .join(" / ");

      return {
        id: assignment.productId,
        name: product?.name || "Assigned product",
        code: product?.id?.slice(0, 8) || assignment.productId.slice(0, 8),
        productType: product?.type || "—",
        portfolioSize: formatCompactAmount(product?.size),
        status: product?.status || "Assigned",
        lastUpdated: formatDateTimeDdMmYyyy(product?.updated),
        changes: permissions || undefined,
      };
    });
  }, [assignments, catalog]);

  const columns: Column<AssignedProduct>[] = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" aria-label="Select all products" />
          <span className="uppercase text-[#2F3140]">PRODUCT ({rows.length})</span>
        </div>
      ),
      className: "w-[25%]",
      render: (product) => (
        <div>
          <p className="font-bold text-[#2F3140] text-sm">{product.name}</p>
          <p className="text-[#707781] text-xs">{product.code}</p>
        </div>
      ),
    },
    {
      header: <FilterableHeader>PRODUCT TYPE</FilterableHeader>,
      className: "w-[15%]",
      render: (product) => (
        <span className="text-sm text-[#2F3140] font-medium">{product.productType}</span>
      ),
    },
    {
      header: <FilterableHeader>PORTFOLIO SIZE</FilterableHeader>,
      className: "w-[15%]",
      render: (product) => (
        <span className="text-sm text-[#2F3140] font-medium">{product.portfolioSize}</span>
      ),
    },
    {
      header: <FilterableHeader>STATUS</FilterableHeader>,
      className: "w-[15%]",
      render: (product) => <StatusBadge status={product.status as never} />,
    },
    {
      header: <FilterableHeader>LAST UPDATED ON</FilterableHeader>,
      className: "w-[15%]",
      render: (product) => (
        <span className="text-sm text-[#2F3140] font-medium">{product.lastUpdated}</span>
      ),
    },
  ];

  if (mode === "approval") {
    columns.push({
      header: "ACCESS",
      className: "w-[15%]",
      render: (product) =>
        product.changes ? (
          <span className="px-3 py-1 bg-[#FDE4E5] text-[#B2171E] rounded-full text-xs font-semibold">
            {product.changes}
          </span>
        ) : null,
    });
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard title="Download Table as PDF" actionText="Download" />
        <ActionCard title="Export Table as CSV" actionText="Export" />
      </div>
      <Table data={rows} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default ActiveProductsTab;
