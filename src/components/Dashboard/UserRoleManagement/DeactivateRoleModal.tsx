"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface DeactivateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: (newRoleId: string) => void;
  roleName?: string;
}

const DeactivateRoleModal: React.FC<DeactivateRoleModalProps> = ({
  isOpen,
  onClose,
  onDeactivate,
}) => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleDeactivate = () => {
    if (selectedRole) {
      onDeactivate(selectedRole);
      setSelectedRole("");
    }
  };

  const handleClose = () => {
    setSelectedRole("");
    onClose();
  };

  // Mock roles - in real app, this would come from props or API
  const availableRoles = [
    { value: "1", label: "Admin" },
    { value: "2", label: "User" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-8">
        <h3 className="text-lg font-bold text-[#2F3140] mb-2">
          Assign users to another role
        </h3>
        <p className="text-sm text-[#707781] mb-6">
          You will need to assign all users to another role before you can
          deactivate it
        </p>

        {/* Role Selection Dropdown */}
        <div className="mb-8">
          <Input
            label="Select new Role"
            type="select"
            theme="light"
            required
            placeholder="Select option"
            options={availableRoles}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 w-full">
          <div className="w-32">
            <Button
              text="Cancel"
              variant="outline"
              onClick={handleClose}
              className="bg-[#F4F4F5] font-bold text-xs"
            />
          </div>
          <div className="w-56">
            <Button
              text="Reassign and Deactivate Role"
              variant="primary"
              onClick={handleDeactivate}
              disabled={!selectedRole}
              className="font-bold bg-[#B2171E] text-xs"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateRoleModal;
