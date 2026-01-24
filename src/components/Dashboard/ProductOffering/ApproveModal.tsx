"use client";

import React from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  onApprove,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <h3 className="text-lg font-bold text-[#2F3140] mb-2">
          Approve Request?
        </h3>
        <p className="text-sm text-[#707781] mb-8">
          Are you sure you want to approve this request?
        </p>

        <div className="flex justify-end gap-4 w-full">
          <div className="w-32">
            <Button
              text="Cancel"
              variant="outline"
              onClick={onClose}
              className=""
            />
          </div>
          <div className="w-40">
            <Button
              text="Yes, Approve"
              variant="primary"
              onClick={onApprove}
              className=""
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveModal;
