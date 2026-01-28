"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";

import { CREATE_USER_FORM_SECTIONS } from "@/constants/userRoleManagement/createUser";

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Record<string, string>;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    initialData || {},
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const requiredFields = useMemo(
    () =>
      CREATE_USER_FORM_SECTIONS.flatMap((section) =>
        section.fields
          .filter((field) => field.required)
          .map((field) => field.label),
      ),
    [],
  );

  const isFormValid = useMemo(() => {
    return requiredFields.every((fieldLabel) => {
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [formData, requiredFields]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleCreateUser = () => {
    if (isFormValid) {
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

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          User Creation Successful
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          User creation was successfully sent for approver confirmation.
        </p>
        <div className="flex gap-4">
          <div className=" w-56">
            <Button
              text="Create Another User"
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
      {CREATE_USER_FORM_SECTIONS.map((section, index) => (
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
                type={field.type as "text" | "select" | "date" | "email"}
                options={field.options}
                required={field.required}
                value={formData[field.label] || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex justify-end gap-4 mt-8 pt-4">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text={initialData ? "Update User" : "Create User"}
            variant="primary"
            disabled={!isFormValid}
            onClick={handleCreateUser}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
