"use client";

import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

interface RemoveIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  integrationName: string;
}

const RemoveIntegrationModal: React.FC<RemoveIntegrationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  integrationName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-6">
      <h2 className="text-xl font-bold text-[#101828] mb-2">
        Remove Connection?
      </h2>
      <p className="text-sm text-[#475467] mb-8">
        Are you sure you want to remove integration connection for{" "}
        {integrationName}?
      </p>

      <div className="flex gap-3 justify-end items-center">
        <div className="flex justify-end gap-3 w-full">
          <div className="w-24">
            <Button
              text="Cancel"
              variant="outline"
              onClick={onClose}
              className="text-sm"
            />
          </div>
          <div className="w-40">
            <Button
              text="Yes, Disconnect"
              variant="primary"
              onClick={onConfirm}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveIntegrationModal;
