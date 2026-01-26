"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import CustomCheckbox from "@/components/CustomCheckbox";
import Image from "next/image";

interface CreateRoleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

import { PERMISSION_MODULES } from "@/constants/userRoleManagement/createRole";

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
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
          Role Creation Successful
        </h2>
        <p className="text-sm text-[#707781] mb-8 text-center">
          Role creation was successfully sent for approver confirmation.
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

  return (
    <div className="flex flex-col gap-8 pb-8">
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
            onChange={(e) => setRoleName(e.target.value)}
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
            text="Create Role"
            variant="primary"
            disabled={!isFormValid}
            onClick={handleCreateRole}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRoleForm;
