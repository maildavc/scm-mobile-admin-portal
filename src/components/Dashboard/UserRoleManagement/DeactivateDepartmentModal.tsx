"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface DeactivateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: (newDepartmentId: string) => void;
  departmentName?: string;
}

const DeactivateDepartmentModal: React.FC<DeactivateDepartmentModalProps> = ({
  isOpen,
  onClose,
  onDeactivate,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleDeactivate = () => {
    if (selectedDepartment) {
      onDeactivate(selectedDepartment);
      setSelectedDepartment("");
    }
  };

  const handleClose = () => {
    setSelectedDepartment("");
    onClose();
  };

  // Mock departments - in real app, this would come from props or API
  const availableDepartments = [
    { value: "1", label: "Legal" },
    { value: "2", label: "Finance" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-8">
        <h3 className="text-lg font-bold text-[#2F3140] mb-2">
          Assign users to another department
        </h3>
        <p className="text-sm text-[#707781] mb-6">
          You will need to assign all users to another department before you can
          deactivate it
        </p>

        {/* Department Selection Dropdown */}
        <div className="mb-8">
          <Input
            label="Select new Department"
            type="select"
            theme="light"
            required
            placeholder="Select option"
            options={availableDepartments}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 w-full">
          <div className="">
            <Button
              text="Cancel"
              variant="outline"
              onClick={handleClose}
              className="bg-[#F4F4F5] font-bold text-xs px-5"
            />
          </div>
          <div className="">
            <Button
              text="Reassign and Deactivate Department"
              variant="primary"
              onClick={handleDeactivate}
              disabled={!selectedDepartment}
              className="font-bold bg-[#B2171E] text-xs px-5"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateDepartmentModal;
