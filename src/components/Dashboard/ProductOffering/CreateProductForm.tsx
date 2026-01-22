"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { FiUploadCloud } from "react-icons/fi";
import { FORM_SECTIONS } from "@/constants/productOffering/createProduct";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
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
  const [formData, setFormData] = useState<Record<string, string | File>>(() => {
    if (initialData) {
      return {
        "Product Name": initialData.name,
        "Instrument Type": initialData.type,
      };
    }
    return {} as Record<string, string | File>;
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Get all required fields from all sections (memoized to prevent infinite loop)
  const requiredFields = useMemo(() => 
    FORM_SECTIONS.flatMap((section) =>
      section.fields
        .filter((field) => field.required)
        .map((field) => field.label),
    ), []
  );

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return requiredFields.every((fieldLabel) => {
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [formData, requiredFields]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleFileChange = (label: string, file: File | null) => {
    if (file) {
      setFormData((prev) => ({ ...prev, [label]: file }));
    }
  };

  const handleCreateProduct = () => {
    if (isFormValid) {
      // Here you would normally send the data to an API
      setShowSuccess(true);
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
          <Image
            src="/success.svg"
            alt="Success"
            width={80}
            height={80}
          />
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
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text="Create Product"
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
