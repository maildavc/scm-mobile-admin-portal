import React, { useState } from "react";
import Button from "@/components/Button";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import { DetailCard, DetailRow } from "@/components/Dashboard/SharedDetails";
import ApproveModal from "@/components/Dashboard/Shared/ApproveModal";
import RejectModal from "@/components/Dashboard/Shared/RejectModal";
import { useProductDetail, useApproveProduct } from "@/hooks/useProducts";
import { useToastStore } from "@/stores/toastStore";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Inactive" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

interface ViewProductRequestProps {
  product: Product;
  onApprove: () => void;
  onReject: () => void;
}

const ViewProductRequest: React.FC<ViewProductRequestProps> = ({
  product,
  onApprove,
  onReject,
}) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewStatus, setViewStatus] = useState<
    "review" | "success" | "rejected"
  >("review");

  const { data: detailRes, isLoading } = useProductDetail(product.id);
  const approveProduct = useApproveProduct();
  const addToast = useToastStore((s) => s.addToast);

  const detail = detailRes?.value?.data;

  // Build product details from API data
  const productDetails = detail?.productDetails
    ? [
        { label: "Product Name", value: detail.productDetails.productName },
        {
          label: "Instrument Type",
          value: detail.productDetails.instrumentType,
        },
        { label: "Issuer", value: detail.productDetails.issuer },
        { label: "Sector", value: detail.productDetails.sector },
      ]
    : [];

  // Build financial details from API data
  const financialDetails = detail?.financialDetails
    ? [
        {
          label: "Selling Price",
          value: `₦${detail.financialDetails.sellingPrice?.toLocaleString() || "0"}`,
        },
        {
          label: "Available Volume",
          value: detail.financialDetails.availableVolume?.toLocaleString() || "0",
        },
        {
          label: "Interest or returns Percentage",
          value: `${detail.financialDetails.interestOrReturnsPercentage || "0"}%`,
        },
        {
          label: "Minimum Investment Amount",
          value: `₦${detail.financialDetails.minimumInvestmentAmount?.toLocaleString() || "0"}`,
        },
        {
          label: "Maximum Investment Amount",
          value: `₦${detail.financialDetails.maximumInvestmentAmount?.toLocaleString() || "0"}`,
        },
        {
          label: "Settlement Date",
          value: detail.financialDetails.settlementDate ? new Date(
            detail.financialDetails.settlementDate,
          ).toLocaleDateString() : "N/A",
        },
        {
          label: "Allow for Early Liquidation",
          value: detail.financialDetails.allowForEarlyLiquidation
            ? "Yes"
            : "No",
        },
        {
          label: "Early Liquidation Period",
          value: detail.financialDetails.earlyLiquidationPeriod || "N/A",
        },
        {
          label: "Early Liquidation Penalty?",
          value: detail.financialDetails.earlyLiquidationPenalty || "N/A",
        },
        { label: "WHT Amount", value: `${detail.financialDetails.whtAmount || "0"}%` },
        {
          label: "Applicable Tax",
          value: `${detail.financialDetails.applicableTax || "0"}%`,
        },
      ]
    : [];

  const handleApproveConfirm = async () => {
    setIsApproveModalOpen(false);
    try {
      await approveProduct.mutateAsync({
        productId: product.id,
        payload: { productId: product.id, action: "approve", reason: null },
      });
      setViewStatus("success");
    } catch {
      addToast("Failed to approve product", "error");
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsRejectModalOpen(false);
    try {
      await approveProduct.mutateAsync({
        productId: product.id,
        payload: { productId: product.id, action: "reject", reason },
      });
      setViewStatus("rejected");
    } catch {
      addToast("Failed to reject product", "error");
    }
  };

  if (viewStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Product Approved Successfully
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Product was successfully approved.
        </p>
        <div className="w-32">
          <Button
            text="Done"
            variant="primary"
            onClick={onApprove}
            className="bg-[#B2171E] font-bold"
          />
        </div>
      </div>
    );
  }

  if (viewStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Product Rejected
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Product was successfully rejected.
        </p>
        <div className="w-32">
          <Button
            text="Done"
            variant="primary"
            onClick={onReject}
            className="bg-[#B2171E] font-bold"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApproveConfirm}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleRejectConfirm}
      />

      {/* Creator Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
          <BiUser size={20} />
        </div>
        <div>
          <p className="text-[10px] text-[#707781] font-semibold">Created By</p>
          <p className="text-sm font-bold text-[#2F3140]">{product.name}</p>
          <p className="text-xs text-[#707781]">
            {detail?.createdAt
              ? new Date(detail.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : product.updated}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Details Card */}
        <DetailCard title="Product Details">
          {productDetails.map((detail) => (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </DetailCard>

        {/* Financial Details Card */}
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

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex justify-end gap-3 border-t border-transparent">
        <div className="w-32">
          <Button
            text="Reject Request"
            variant="outline"
            onClick={() => setIsRejectModalOpen(true)}
            className="text-[#B2171E]! text-xs md:text-sm"
          />
        </div>
        <div className="w-40">
          <Button
            text="Approve Request"
            variant="primary"
            onClick={() => setIsApproveModalOpen(true)}
            className="text-xs md:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProductRequest;
