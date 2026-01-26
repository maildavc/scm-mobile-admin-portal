"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";

interface CreateDepartmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = useMemo(() => {
    return departmentName.trim() !== "";
  }, [departmentName]);

  const handleCreateDepartment = () => {
    if (isFormValid) {
      setShowSuccess(true);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setDepartmentName("");
    setDescription("");
  };

  const handleDone = () => {
    setShowSuccess(false);
    setDepartmentName("");
    setDescription("");
    onSuccess?.();
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          Department Creation Successful
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Department creation was successfully sent for approver confirmation.
        </p>
        <div className="flex gap-4">
          <div className="w-56">
            <Button
              text="Create Another Department"
              variant="outline"
              onClick={handleCreateAnother}
              className="text-sm"
            />
          </div>
          <div className="w-32">
            <Button text="Done" variant="primary" onClick={handleDone} className="text-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Department Information Section */}
      <section>
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Department Information
        </h3>
        <p className="text-sm text-[#707781] mb-6">
          Tell us about this department
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Input
            label="Department Name"
            placeholder="Enter name"
            theme="light"
            type="text"
            required={true}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <Input
            label="Department Description (Optional)"
            placeholder="Enter description"
            theme="light"
            type="text"
            required={false}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-4">
        <div className="w-32">
          <Button
            text="Cancel"
            variant="outline"
            onClick={onCancel}
            className="text-sm"
          />
        </div>
        <div className="w-40">
          <Button
            text="Create Department"
            variant="primary"
            disabled={!isFormValid}
            onClick={handleCreateDepartment}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDepartmentForm;
