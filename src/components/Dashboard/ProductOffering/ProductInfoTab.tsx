import React from "react";
import Button from "@/components/Button";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import ProductPerformanceChart from "./ProductPerformanceChart";
import {
  PRODUCT_DETAILS,
  FINANCIAL_DETAILS,
} from "@/constants/productOffering/productOffering";

interface ProductInfoTabProps {
  onEdit?: () => void;
  onDeactivate?: () => void;
  status: "Active" | "Deactivated" | "Awaiting Approval";
}

const ProductInfoTab: React.FC<ProductInfoTabProps> = ({
  onEdit,
  onDeactivate,
  status,
}) => {
  return (
    <>
      <ProductPerformanceChart />

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DetailCard title="Product Details">
          {PRODUCT_DETAILS.map((detail) => (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-[#707781]">Product Status</span>
            <StatusBadge status={status} />
          </div>
        </DetailCard>

        <DetailCard title="Financial Details">
          {FINANCIAL_DETAILS.map((detail) => (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </DetailCard>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6">
        <div className="w-48">
          <Button
            text="Deactivate Product"
            variant="outline"
            onClick={onDeactivate}
            className="text-xs lg:text-sm"
          />
        </div>
        <div className="w-48">
          <Button
            text="Edit Product Info"
            variant="primary"
            onClick={onEdit}
            className="text-xs lg:text-sm"
          />
        </div>
      </div>
    </>
  );
};

const DetailCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border rounded-xl p-4 border-[#F4F4F5]">
    <h3 className="text-sm font-semibold text-[#2F3140] mb-6">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
    <span className="text-sm text-[#707781]">{label}</span>
    <span className="text-sm text-[#2F3140] font-medium">{value}</span>
  </div>
);

export default ProductInfoTab;
