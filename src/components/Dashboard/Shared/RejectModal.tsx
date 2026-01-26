"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TextArea from "@/components/TextArea";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  title?: string;
  description?: string;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onReject,
  title = "Reject Request?",
  description = "Are you sure you want to reject this request?",
}) => {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (reason.trim()) {
      onReject(reason);
      setReason("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <h3 className="text-lg font-bold text-[#2F3140] mb-2">{title}</h3>
        <p className="text-sm text-[#707781] mb-6">{description}</p>

        <div className="mb-8">
          <TextArea
            label="Rejection Reason"
            placeholder="Enter rejection reason"
            theme="light"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4 w-full">
          <div className="w-32">
            <Button
              text="Cancel"
              variant="outline"
              onClick={onClose}
              className="bg-[#F4F4F5] font-bold border-none"
            />
          </div>
          <div className="w-40">
            <Button
              text="Yes, Reject"
              variant="primary"
              onClick={handleReject}
              disabled={!reason.trim()}
              className="font-bold bg-[#B2171E]"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
