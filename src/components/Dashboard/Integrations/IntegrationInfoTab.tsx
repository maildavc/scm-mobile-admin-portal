"use client";

import React from "react";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { Integration } from "@/constants/integrations/integrations";
import { FiUser } from "react-icons/fi"; // Placeholder for avatar

interface IntegrationInfoTabProps {
  integration: Integration;
  onRemove?: () => void;
  onEdit?: () => void;
}

const IntegrationInfoTab: React.FC<IntegrationInfoTabProps> = ({
  integration,
  onRemove,
  onEdit,
}) => {
  const subscribedProducts = [
    { name: "Access Bank 30% Equity", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6">
        {/* Left Column - Integration Details */}
        <div className="w-1/2 ">
          <DetailCard
            title=""
            className="h-full"
            headerContent={
              <div className="w-20 h-20 rounded-full bg-[#1A1C29] flex items-center justify-center">
                <FiUser size={32} className="text-white" />
              </div>
            }
          >
            <DetailRow label="Integration name" value={integration.name} />
            <DetailRow
              label="Description"
              value={integration.description || "No description"}
            />
            <DetailRow
              label="Client URL"
              value="https://accessbankplc.com.ng"
            />
            <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
              <span className="text-sm text-[#2F3140]">
                Connection Status Status
              </span>
              <StatusBadge status="Active" displayLabel="Test connected" />
            </div>
          </DetailCard>
        </div>

        {/* Right Column - Subscribed Products */}
        <div className="w-1/2">
          <div className="border rounded-xl p-6 border-[#F4F4F5] h-full">
            <h3 className="text-sm font-bold text-[#2F3140] mb-6">
              All subscribed products
            </h3>
            <div className="space-y-4">
              {subscribedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-[#F4F4F5]"
                >
                  <span className="text-sm text-[#2F3140]">{product.name}</span>
                  <span className="text-xs text-[#707781]">
                    {product.count} customers subscribed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3">
        <div className="w-40">
          <Button
            text="Remove Connection"
            variant="outline"
            onClick={onRemove}
            className="font-bold! text-xs"
          />
        </div>
        <div className="w-32">
          <Button
            text="Edit Info"
            variant="primary"
            onClick={onEdit}
            className="text-xs font-bold!"
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationInfoTab;
