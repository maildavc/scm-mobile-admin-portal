"use client";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CustomCheckbox from "@/components/CustomCheckbox";
import { BASIC_INFO_FIELDS, PRODUCT_TYPES } from "@/constants/customerManagement/createCustomer";
import Image from "next/image";
import { useCustomerForm } from "@/hooks/useCustomerForm";

type Customer = {
  id: string;
  name: string;
  tier: string;
  status: "Active" | "Deactivated" | "Awaiting Approval";
  kycStatus: "Awaiting Approval" | "Completed";
  updated: string;
};

interface CreateCustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Customer | null;
}

const CreateCustomerForm: React.FC<CreateCustomerFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const {
    formData,
    productAssignments,
    showSuccess,
    isFormValid,
    handleInputChange,
    handleProductToggle,
    handleSaveChanges,
    handleCreateAnother,
    handleDone,
  } = useCustomerForm(initialData);

  // Success Screen
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          {initialData ? "Customer Details Updated Successfully" : "Customer Creation Successful"}
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center max-w-sm">
          {initialData 
            ? "Edit to customer details was successfully sent for approver confirmation."
            : "Customer creation was successfully sent for approver confirmation."}
        </p>
        <div className="flex gap-4 justify-center">
          {!initialData && (
            <div className="w-56">
              <Button
                text="Create Another Customer"
                variant="outline"
                onClick={handleCreateAnother}
              />
            </div>
          )}
          <div className="w-32">
            <Button text="Done" variant="primary" onClick={() => handleDone(onSuccess)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Basic Information Section */}
      <section>
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Basic Information
        </h3>
        <p className="text-sm text-[#707781] mb-6">Tell us about user</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BASIC_INFO_FIELDS.map((field, fieldIndex) => (
            <Input
              key={fieldIndex}
              label={field.label}
              placeholder={field.placeholder}
              theme="light"
              type={field.type}
              options={field.options}
              required={field.required}
              readOnly={field.readOnly}
              className={field.className}
              value={(formData[field.label] as string) || ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
            />
          ))}
        </div>
      </section>

      {/* Assign Products Section */}
      <section>
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Assign Products
        </h3>
        <p className="text-sm text-[#707781] mb-6">
          Select what products this customer should have
        </p>
        <div className="bg-[#F9F9F9] rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4">
            {PRODUCT_TYPES.map((product) => (
              <div key={product.id} className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-[#555555] uppercase tracking-wider mb-2">
                  {product.name}
                </h4>
                <div className="flex flex-col gap-3">
                  <CustomCheckbox 
                    checked={productAssignments[product.id]?.buy || false}
                    onChange={() => handleProductToggle(product.id, "buy")}
                    label="Buy"
                  />
                  <CustomCheckbox 
                    checked={productAssignments[product.id]?.sell || false}
                    onChange={() => handleProductToggle(product.id, "sell")}
                    label="Sell"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-4">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text="Save Changes"
            variant="primary"
            disabled={!isFormValid}
            onClick={handleSaveChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerForm;
                    
