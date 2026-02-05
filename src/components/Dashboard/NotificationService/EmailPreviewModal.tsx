import React, { useEffect } from "react";
import EmailPreview from "./EmailPreview";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  body,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000000]/64 transition-opacity"
        onClick={onClose}
      />

      {/* Content */}
      <div onClick={onClose} className="relative max-w-5xl w-full">
        <EmailPreview
          title={
            title || "Welcome to SCM Asset Plus — Invest in both Naira and USD"
          }
          body={
            body ||
            "We're here to guide you in making smart investments and achieving your financial dreams. Let's take the first step together toward a future of lasting prosperity"
          }
        />
      </div>
    </div>
  );
};

export default EmailPreviewModal;
