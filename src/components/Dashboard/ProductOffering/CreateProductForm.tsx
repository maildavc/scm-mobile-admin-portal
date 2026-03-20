"use client";

import React, { useState, useMemo, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { FiUploadCloud } from "react-icons/fi";
import { FORM_SECTIONS } from "@/constants/productOffering/createProduct";
import Image from "next/image";
import { useCreateProduct, useUpdateProduct, useProductDetail } from "@/hooks/useProducts";
import { useToastStore } from "@/stores/toastStore";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Inactive" | "Deactivated" | "Awaiting Approval";
  updated: string;
};

interface CreateProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Product | null;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<Record<string, string | File>>(
    () => {
      if (initialData) {
        return {
          "Product Name": initialData.name,
          "Instrument Type": initialData.type,
        };
      }
      return {} as Record<string, string | File>;
    },
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: detailRes, isLoading: isLoadingDetail } = useProductDetail(
    initialData?.id || ""
  );

  useEffect(() => {
    if (isEditing && detailRes?.value?.data) {
      const { productDetails: pd, financialDetails: fd, integration: intg } = detailRes.value.data;
      setFormData((prev) => ({
        ...prev,
        "Product Name": pd?.productName || initialData?.name || "",
        "Instrument Type": pd?.instrumentType || initialData?.type || "",
        "Issuer": pd?.issuer || "",
        "Sector": pd?.sector || "",
        "Selling Price": fd?.sellingPrice?.toString() || "",
        "Available Volume": fd?.availableVolume?.toString() || "",
        "Interest or returns Percentage": fd?.interestOrReturnsPercentage?.toString() || "",
        "Minimum Investment Amount": fd?.minimumInvestmentAmount?.toString() || "",
        "Maximum Investment Amount": fd?.maximumInvestmentAmount?.toString() || "",
        "Settlement Date": fd?.settlementDate ? fd.settlementDate.split("T")[0] : "",
        "Allow for Early Liquidation": fd?.allowForEarlyLiquidation ? "yes" : "no",
        "Early Liquidation Period": fd?.earlyLiquidationPeriod?.toString() || "",
        "Early Liquidation Penalty?": fd?.earlyLiquidationPenalty || "",
        "WHT Amount": fd?.whtAmount?.toString() || "",
        "Applicable Tax": fd?.applicableTax?.toString() || "",
        "Source": intg?.source || "",
      }));
    }
  }, [detailRes, isEditing, initialData]);

  // Get all required fields from all sections (memoized to prevent infinite loop)
  const requiredFields = useMemo(
    () =>
      FORM_SECTIONS.flatMap((section) =>
        section.fields
          .filter((field) => field.required)
          .map((field) => field.label),
      ),
    [],
  );

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return requiredFields.every((fieldLabel) => {
      // When editing, the API might not return the existing logo, so don't block submission
      if (isEditing && fieldLabel === "Issuers Logo") {
        return true;
      }
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [formData, requiredFields, isEditing]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleFileChange = (label: string, file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, [label]: file }));
    }
  };

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const addToast = useToastStore((s) => s.addToast);

  // Helper to convert File to Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateProduct = async () => {
    if (!isFormValid) return;

    let issuersLogoBase64 = "";
    const logoFile = formData["Issuers Logo"];
    if (logoFile instanceof File) {
      // The base64 string includes 'data:image/png;base64,...' 
      // The backend will receive it as a string
      issuersLogoBase64 = await fileToBase64(logoFile);
    } else if (typeof logoFile === "string" && logoFile.startsWith("data:")) {
      issuersLogoBase64 = logoFile;
    }

    // Build the nested payload object based on the new Backend DTO
    const corePayload = {
      basicInformation: {
        productName: formData["Product Name"] as string,
        instrumentType: formData["Instrument Type"] as string,
        issuer: formData["Issuer"] as string,
        sector: formData["Sector"] as string,
        description: "", // added to match new DTO requirements
        issuersLogo: issuersLogoBase64
      },
      financialInformation: {
        sellingPrice: parseFloat(formData["Selling Price"] as string) || 0,
        availableVolume: parseInt(formData["Available Volume"] as string, 10) || 0,
        interestOrReturnsPercentage: parseFloat(formData["Interest or returns Percentage"] as string) || 0,
        minimumInvestmentAmount: parseFloat(formData["Minimum Investment Amount"] as string) || 0,
        maximumInvestmentAmount: parseFloat(formData["Maximum Investment Amount"] as string) || 0,
        settlementDate: formData["Settlement Date"] 
          ? new Date(formData["Settlement Date"] as string).toISOString() 
          : new Date().toISOString(),
        // Mapping liquidation info into financialInformation per new payload structure
        allowForEarlyLiquidation: formData["Allow for Early Liquidation"] === "yes",
        earlyLiquidationPeriod: (formData["Early Liquidation Period"] as string) || "",
        earlyLiquidationPenalty: (formData["Early Liquidation Penalty?"] as string) || "",
        whtAmount: parseFloat(formData["WHT Amount"] as string) || 0,
        applicableTax: parseFloat(formData["Applicable Tax"] as string) || 0
      }
    };

    try {
      if (isEditing && initialData) {
        // PUT requires the createProduct wrapper to be valid in the database
        await updateProduct.mutateAsync({
          productId: initialData.id,
          payload: { createProduct: corePayload },
        });
        addToast("Product updated successfully", "success");
      } else {
        // POST also requires the createProduct wrapper
        await createProduct.mutateAsync({ createProduct: corePayload });
        addToast("Product created successfully", "success");
      }
      setShowSuccess(true);
    } catch {
      addToast(
        isEditing ? "Failed to update product" : "Failed to create product",
        "error",
      );
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setFormData({});
  };

  const handleDone = () => {
    setShowSuccess(false);
    setFormData({});
    onSuccess?.();
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Product Creation Successful
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Product creation was successfully sent for approver confirmation.
        </p>
        <div className="flex gap-4">
          <div className=" w-56">
            <Button
              text="Create Another Product"
              variant="outline"
              onClick={handleCreateAnother}
            />
          </div>
          <div className="w-32">
            <Button text="Done" variant="primary" onClick={handleDone} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {FORM_SECTIONS.map((section, index) => (
        <section key={index}>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">
            {section.title}
          </h3>
          <p className="text-xs text-[#707781] mb-4">{section.description}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {section.fields.map((field, fieldIndex) => (
              <Input
                key={fieldIndex}
                label={field.label}
                placeholder={field.placeholder}
                theme="light"
                type={field.type}
                options={field.options}
                required={field.required}
                rightIcon={
                  field.hasUploadIcon ? <FiUploadCloud size={18} /> : undefined
                }
                readOnly={field.readOnly}
                className={field.className}
                value={(formData[field.label] as string) || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                onFileChange={
                  field.type === "file"
                    ? (file) => handleFileChange(field.label, file)
                    : undefined
                }
              />
            ))}
            {section.hasCustomContent && (
              <div className="border border-[#00A85A] bg-white rounded-xl p-3 flex items-center gap-3">
                <div className="">
                  <Image
                    src="/abbey.svg"
                    alt="abbey Logo"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2F3140]">Abbeys BD</p>
                  <p className="text-[10px] text-[#707781]">
                    Abbey Mortgage Bank PLC
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="flex justify-end gap-4 mt-8 pt-4">
        {isLoadingDetail && isEditing && (
          <span className="text-sm text-gray-400 self-center mr-4">Loading product details...</span>
        )}
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text={isEditing ? "Update Product" : "Create Product"}
            variant="primary"
            disabled={!isFormValid}
            onClick={handleCreateProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;
