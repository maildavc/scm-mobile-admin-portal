"use client";

import React from "react";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import Button from "@/components/Button";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import { IntegrationDto } from "@/types/integration";
import { useIntegrationDetails } from "@/hooks/useIntegration";
import Image from "next/image";

interface IntegrationInfoTabProps {
  integration: IntegrationDto;
  onRemove?: () => void;
  onEdit?: () => void;
}

const IntegrationInfoTab: React.FC<IntegrationInfoTabProps> = ({
  integration,
  onRemove,
  onEdit,
}) => {
  const { data: details } = useIntegrationDetails(integration.id);

  // We fall back to the basic `integration` prop (which contains core info)
  // while the robust `IntegrationDetailsDto` loads.
  const displayData = details || integration;

  // The backend doesn't currently provide Subscribed Products.
  // Displaying placeholder array just as the design shows.
  const subscribedProducts = [
    { name: "Access Bank 30% Equity", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
    { name: "Name of product here", count: 102 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Integration Details */}
        <div className="w-full lg:w-1/2">
          <DetailCard
            title=""
            className="h-full"
            headerContent={
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Image
                  src={displayData.iconUrl || "/scmLogo.svg"}
                  alt={displayData.name || "Logo"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
            }
          >
            <DetailRow label="Integration name" value={displayData.name || "N/A"} />
            <DetailRow
              label="Description"
              value={displayData.description || "No description"}
            />
            <DetailRow
              label="Client URL"
              value={displayData.endpointUrl || "N/A"}
            />
            <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
              <span className="text-sm text-[#2F3140]">
                Connection Status
              </span>
              <StatusBadge status={(displayData.statusName || "Pending") as "Active" | "Fatal" | "Shortage" | "Failed"} />
            </div>
          </DetailCard>
        </div>

        {/* Right Column - Subscribed Products */}
        <div className="w-full lg:w-1/2">
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
            className="font-bold! text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationInfoTab;
