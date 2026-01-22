"use client";

import React, { useState } from "react";
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

const ViewProduct: React.FC<ViewProductProps> = ({ product, onEdit, onDeactivate }) => {
  const [activeTab, setActiveTab] = useState("Product Info");

  const tabs = ["Product Info", "Configuration"];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer border ${
              activeTab === tab
                ? "bg-[#FDE4E5] text-[#B2171E] border-[#FFC6C5]"
                : "bg-white text-[#2F3140] border-[#7077813D]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Product Info" ? (
        <ProductInfoTab onEdit={onEdit} onDeactivate={onDeactivate} status={product.status} />
      ) : (
        <ConfigurationTab onDeactivate={onDeactivate} />
      )}
    </div>
  );
};

export default ViewProduct;
