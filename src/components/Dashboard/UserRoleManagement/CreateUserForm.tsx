"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";
import {
  useCreateUser,
  useRoles,
  useDepartments,
} from "@/hooks/useUserManagement";

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
  const [errorMsg, setErrorMsg] = useState("");

  const createUser = useCreateUser();

  const { data: rolesData } = useRoles({ page: 1, limit: 100 });
  const { data: departmentsData } = useDepartments({ page: 1, limit: 100 });

  const roleOptions = useMemo(() => {
    const roles = Array.isArray(rolesData) ? rolesData : [];
    return roles
      .filter((r: { status?: string }) => r.status?.toLowerCase() === "approved")
      .map((r: { name: string; id: string }) => ({
        label: r.name,
        value: r.id,
      }));
  }, [rolesData]);

  const departmentOptions = useMemo(() => {
    const departments = Array.isArray(departmentsData)
      ? departmentsData
      : [];
    return departments
      .filter((d: { status?: string }) => d.status?.toLowerCase() === "approved")
      .map((d: { name: string; id: string }) => ({
        label: d.name,
        value: d.id,
      }));
  }, [departmentsData]);

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
    const isPermanent = formData["Expiry Status"] === "Permanent";
    return requiredFields.every((fieldLabel) => {
      // Expires is not required when Permanent
      if (fieldLabel === "Expires" && isPermanent) return true;
      const value = formData[fieldLabel];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [formData, requiredFields]);

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [label]: value };
      // Clear Expires when switching to Permanent
      if (label === "Expiry Status" && value === "Permanent") {
        next["Expires"] = "";
      }
      return next;
    });
  };

  const handleCreateUser = () => {
    if (isFormValid) {
      setErrorMsg("");

      const payload = {
        basicInformation: {
          firstName: formData["First Name"] || "",
          middleName: formData["Middle Name"] || undefined,
          lastName: formData["Last Name"] || "",
          email: formData["Email Address"] || "",
          phoneNumber: formData["Phone Number"] || "",
        },
        department: formData["Department"] || undefined,
        assignRole: {
          role: formData["Assign Role"] || "",
          expiryStatus: formData["Expiry Status"] || "Permanent",
          expires: formData["Expires"] || undefined,
          departmentId: formData["Department"] || undefined,
        },
      };

      createUser.mutate(payload,
        {
          onSuccess: () => setShowSuccess(true),
          onError: (error: Error | unknown) => {
            const err = error as {
              response?: { data?: { message?: string } };
              message?: string;
            };
            setErrorMsg(
              err?.response?.data?.message ||
                err?.message ||
                "Failed to create user",
            );
          },
        },
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
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {errorMsg}
        </div>
      )}
      {CREATE_USER_FORM_SECTIONS.map((section, index) => (
        <section key={index}>
          <h3 className="text-sm font-bold text-[#2F3140] mb-1">
            {section.title}
          </h3>
          <p className="text-xs text-[#707781] mb-4">{section.description}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {section.fields.map((field, fieldIndex) => {
              const isPermanent = formData["Expiry Status"] === "Permanent";
              const isExpiresField = field.label === "Expires";
              const isDisabled = isExpiresField && isPermanent;
              const isRequired = isExpiresField ? !isPermanent : field.required;

              return (
                <Input
                  key={fieldIndex}
                  label={field.label}
                  placeholder={field.placeholder}
                  theme="light"
                  type={field.type as "text" | "select" | "date" | "email"}
                  options={
                    field.label === "Assign Role"
                      ? roleOptions
                      : field.label === "Department"
                        ? departmentOptions
                        : field.options
                  }
                  required={isRequired}
                  disabled={isDisabled}
                  value={formData[field.label] || ""}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                />
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-end gap-4 mt-8 pt-4">
        <div className="w-32">
          <Button text="Cancel" variant="outline" onClick={onCancel} />
        </div>
        <div className="w-40">
          <Button
            text={
              createUser.isPending
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                  ? "Update User"
                  : "Create User"
            }
            variant="primary"
            disabled={!isFormValid || createUser.isPending}
            onClick={handleCreateUser}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
