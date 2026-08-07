"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import ProductInfoTab from "./ProductInfoTab";
import ConfigurationTab from "./ConfigurationTab";
import { useProductDetail } from "@/hooks/useProducts";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Inactive" | "Deactivated" | "Awaiting Approval" | "Approved";
  updated: string;
};

interface ViewProductProps {
  product: Product;
  onEdit?: () => void;
  onDeactivate?: () => void;
  onDisable?: () => void;
}

const ViewProduct: React.FC<ViewProductProps> = ({
  product,
  onEdit,
  onDeactivate,
  onDisable,
}) => {
  const [activeTab, setActiveTab] = useState("Product Info");
  const { data: detailRes, isLoading } = useProductDetail(product.id);

  const detail = detailRes?.value?.data;

  const tabs = ["Product Info", "Configuration"];

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Product Info" ? (
        <ProductInfoTab
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          status={product.status}
          productDetail={detail ?? null}
          portfolioSize={product.size}
          isLoading={isLoading}
        />
      ) : (
        <ConfigurationTab
          onDeactivate={onDeactivate}
          onDisable={onDisable}
          portfolioSize={product.size}
        />
      )}
    </div>
  );
};

export default ViewProduct;
