"use client";

import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

interface DeactivateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  roleName?: string;
}

const DeactivateRoleModal: React.FC<DeactivateRoleModalProps> = ({
  isOpen,
  onClose,
  onDeactivate,
}) => {
  const handleDeactivate = () => {
    onDeactivate();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-8">
        <h3 className="text-lg font-bold text-[#2F3140] mb-2">Deactivate role</h3>
        <p className="text-sm text-[#707781] mb-6">
          This role will no longer be available for assignment. The request will fail safely if the
          backend requires existing users to be reassigned first.
        </p>

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
              text="Deactivate Role"
              variant="primary"
              onClick={handleDeactivate}
              className="font-bold bg-[#B2171E] text-xs"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateRoleModal;
