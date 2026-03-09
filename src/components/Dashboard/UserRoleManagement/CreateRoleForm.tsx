"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CustomCheckbox from "@/components/CustomCheckbox";
import Image from "next/image";
import { useCreateRole, useUpdateRole } from "@/hooks/useUserManagement";

interface CreateRoleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editRole?: {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Deactivated" | "Awaiting Approval";
    updated: string;
  } | null;
}

import { PERMISSION_MODULES } from "@/constants/userRoleManagement/createRole";

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  onSuccess,
  onCancel,
  editRole,
}) => {
  const [roleName, setRoleName] = useState(editRole?.name || "");
  const [description, setDescription] = useState(editRole?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [nameError, setNameError] = useState("");

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const isFormValid = useMemo(() => {
    return roleName.trim() !== "";
  }, [roleName]);

  const handleCreateRole = () => {
    if (isFormValid) {
      setErrorMsg("");
      setNameError("");
      const permissions = Object.keys(selectedPermissions).filter(
        (k) => selectedPermissions[k],
      );

      const payload = {
        name: roleName.trim(),
        description: description.trim(),
        permissions,
      };

      if (editRole) {
        updateRole.mutate(
          { id: editRole.id, data: payload },
          {
            onSuccess: () => setShowSuccess(true),
            onError: (error: Error | unknown) => {
              const err = error as {
                response?: { data?: { message?: string; error?: string } };
                message?: string;
              };
              const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update role";
              if (msg.toLowerCase().includes("already exists")) {
                setNameError(msg);
              } else {
                setErrorMsg(msg);
              }
            },
          },
        );
      } else {
        createRole.mutate(payload, {
          onSuccess: () => setShowSuccess(true),
          onError: (error: Error | unknown) => {
            const err = error as {
              response?: { data?: { message?: string; error?: string } };
              message?: string;
            };
            const msg =
              err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              "Failed to create role";
            if (msg.toLowerCase().includes("already exists")) {
              setNameError(msg);
            } else {
              setErrorMsg(msg);
            }
          },
        });
      }
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setRoleName("");
    setDescription("");
    setSelectedPermissions({});
  };

  const handleDone = () => {
    setShowSuccess(false);
    setRoleName("");
    setDescription("");
    setSelectedPermissions({});
    onSuccess?.();
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <Image src="/success.svg" alt="Success" width={80} height={80} />
        </div>
        <h2 className="text-lg font-semibold text-[#2F3140] mb-2">
          {editRole ? "Role Update Successful" : "Role Creation Successful"}
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          {editRole
            ? "Role update was successfully sent for approver confirmation."
            : "Role creation was successfully sent for approver confirmation."}
        </p>
        <div className="flex gap-4">
          <div className="w-56">
            <Button
              text="Create Another Role"
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

  const isPending = createRole.isPending || updateRole.isPending;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {errorMsg}
        </div>
      )}
      {/* Role Information Section */}
      <section>
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Role Information
        </h3>
        <p className="text-sm text-[#707781] mb-6">Tell us about this role</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Input
            label="Role Name"
            placeholder="Enter name"
            theme="light"
            type="text"
            required={true}
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              if (nameError) setNameError("");
            }}
            error={!!nameError}
            errorMessage={nameError}
          />
          <Input
            label="Role Description (Optional)"
            placeholder="Enter description"
            theme="light"
            type="text"
            required={false}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </section>

      {/* Assign Permission Section */}
      <section>
        <h3 className="text-base font-bold text-[#2F3140] mb-1">
          Assign Permission
        </h3>
        <p className="text-sm text-[#707781] mb-6">
          Select what permissions this role should have
        </p>
        <div className="bg-[#F9F9F9] rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4">
            {PERMISSION_MODULES.map((module) => (
              <div key={module.name} className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-[#555555] uppercase tracking-wider mb-2">
                  {module.name}
                </h4>
                <div className="flex flex-col gap-3">
                  {module.permissions.map((permission) => (
                    <CustomCheckbox
                      key={permission}
                      checked={selectedPermissions[permission] || false}
                      onChange={() => handlePermissionToggle(permission)}
                      label={permission}
                    />
                  ))}
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
            text={
              isPending
                ? editRole
                  ? "Updating..."
                  : "Creating..."
                : editRole
                  ? "Update Role"
                  : "Create Role"
            }
            variant="primary"
            disabled={!isFormValid || isPending}
            onClick={handleCreateRole}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRoleForm;
