"use client";

import React, { useState } from "react";
import Tabs from "@/components/Dashboard/Tabs";
import ProductInfoTab from "./ProductInfoTab";
import ConfigurationTab from "./ConfigurationTab";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

interface ViewProductProps {
  product: Product;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

const ViewProduct: React.FC<ViewProductProps> = ({
  product,
  onEdit,
  onDeactivate,
}) => {
  const [activeTab, setActiveTab] = useState("Product Info");

  const tabs = ["Product Info", "Configuration"];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Product Info" ? (
        <ProductInfoTab
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          status={product.status}
        />
      ) : (
        <ConfigurationTab onDeactivate={onDeactivate} />
      )}
    </div>
  );
};

export default ViewProduct;
