import React from "react";
import Button from "@/components/Button";
import { StatusBadge } from "@/components/Dashboard/StatusBadge";
import ProductPerformanceChart from "./ProductPerformanceChart";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import type { ProductDetailData } from "@/types/product";

interface ProductInfoTabProps {
  onEdit?: () => void;
  onDeactivate?: () => void;
  status: "Active" | "Inactive" | "Deactivated" | "Awaiting Approval";
  productDetail: ProductDetailData | null;
  portfolioSize: string;
  isLoading: boolean;
}

const ProductInfoTab: React.FC<ProductInfoTabProps> = ({
  onEdit,
  onDeactivate,
  status,
  productDetail,
  portfolioSize,
  isLoading,
}) => {
  // Build product details from API data
  const productDetails = productDetail?.productDetails
    ? [
        {
          label: "Product Name",
          value: productDetail.productDetails.productName,
        },
        {
          label: "Instrument Type",
          value: productDetail.productDetails.instrumentType,
        },
        { label: "Issuer", value: productDetail.productDetails.issuer },
        { label: "Sector", value: productDetail.productDetails.sector },
      ]
    : [];

  // Build financial details from API data
  const financialDetails = productDetail?.financialDetails
    ? [
        {
          label: "Selling Price",
          value: `₦${productDetail.financialDetails.sellingPrice?.toLocaleString() || "0"}`,
        },
        {
          label: "Available Volume",
          value:
            productDetail.financialDetails.availableVolume?.toLocaleString() || "0",
        },
        {
          label: "Interest or returns Percentage",
          value: `${productDetail.financialDetails.interestOrReturnsPercentage || "0"}%`,
        },
        {
          label: "Minimum Investment Amount",
          value: `₦${productDetail.financialDetails.minimumInvestmentAmount?.toLocaleString() || "0"}`,
        },
        {
          label: "Maximum Investment Amount",
          value: `₦${productDetail.financialDetails.maximumInvestmentAmount?.toLocaleString() || "0"}`,
        },
        {
          label: "Settlement Date",
          value: productDetail.financialDetails.settlementDate ? new Date(
            productDetail.financialDetails.settlementDate,
          ).toLocaleDateString() : "N/A",
        },
        {
          label: "Allow for Early Liquidation",
          value: productDetail.financialDetails.allowForEarlyLiquidation
            ? "Yes"
            : "No",
        },
        {
          label: "Early Liquidation Period",
          value: productDetail.financialDetails.earlyLiquidationPeriod || "N/A",
        },
        {
          label: "Early Liquidation Penalty?",
          value:
            productDetail.financialDetails.earlyLiquidationPenalty || "N/A",
        },
        {
          label: "WHT Amount",
          value: `${productDetail.financialDetails.whtAmount || "0"}%`,
        },
        {
          label: "Applicable Tax",
          value: `${productDetail.financialDetails.applicableTax || "0"}%`,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading product details...
      </div>
    );
  }

  return (
    <>
      <ProductPerformanceChart portfolioSize={portfolioSize} />

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DetailCard title="Product Details">
          {productDetails.map((detail) => (
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
          {financialDetails.map((detail) => (
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

export default ProductInfoTab;
