"use client";

import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { StatusBadge, StatusType } from "@/components/Dashboard/StatusBadge";
import { formatDocumentType } from "@/types/kyc";
import { toKycBadgeStatus } from "@/utils/kycStatus";
import { isUtf8MangledBytes, mimeForPreviewKind, sniffPreviewKind } from "@/utils/filePreview";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string | null;
  filePath?: string | null;
  documentType?: string | number | null;
  status?: string | null;
}

const getPreviewKind = (fileName?: string | null, filePath?: string | null) => {
  const source = `${fileName || ""} ${filePath || ""}`.toLowerCase();
  if (
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(source) ||
    source.includes("image/") ||
    source.includes("signature")
  ) {
    return "image" as const;
  }
  if (/\.pdf(\?|$)/i.test(source) || source.includes("application/pdf") || source.includes("proof of address")) {
    return "pdf" as const;
  }
  return "unknown" as const;
};

const toPreviewUrl = (filePath: string) => {
  if (filePath.startsWith("/api/")) {
    return `/api/proxy${filePath}`;
  }
  return `/api/document-preview?url=${encodeURIComponent(filePath)}`;
};

const PREVIEW_UNAVAILABLE_MESSAGE =
  "This file could not be displayed. The API returned corrupted file content, so there is nothing valid to render.";

const PreviewBody = ({
  filePath,
  fileName,
  kind,
}: {
  filePath: string;
  fileName: string;
  kind: "image" | "pdf" | "unknown";
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvedKind, setResolvedKind] = useState<"image" | "pdf" | "unknown">(kind);
  const previewUrl = toPreviewUrl(filePath);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    setBlobUrl(null);
    setError(null);
    setResolvedKind(kind);

    const load = async () => {
      try {
        const response = await fetch(previewUrl, { credentials: "same-origin" });
        if (!response.ok) {
          let message = PREVIEW_UNAVAILABLE_MESSAGE;
          try {
            const payload = (await response.json()) as { message?: string };
            if (payload.message) message = payload.message;
          } catch {
            // Keep the fallback copy when the proxy returns a non-JSON error.
          }
          if (!cancelled) setError(message);
          return;
        }

        const bytes = new Uint8Array(await response.arrayBuffer());
        if (isUtf8MangledBytes(bytes) || !sniffPreviewKind(bytes)) {
          if (!cancelled) setError(PREVIEW_UNAVAILABLE_MESSAGE);
          return;
        }

        const sniffed = sniffPreviewKind(bytes)!;
        const blob = new Blob([bytes], { type: mimeForPreviewKind(sniffed, bytes) });
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setResolvedKind(sniffed);
          setBlobUrl(objectUrl);
        }
      } catch {
        if (!cancelled) setError(PREVIEW_UNAVAILABLE_MESSAGE);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [previewUrl, kind]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center max-w-lg">
        <p className="text-sm text-[#707781]">{error}</p>
      </div>
    );
  }

  if (!blobUrl) {
    return <p className="text-sm text-[#707781] p-8">Loading preview...</p>;
  }

  if (resolvedKind === "pdf") {
    return <iframe src={blobUrl} title={fileName} className="w-full h-[60vh] border-0" />;
  }

  return (
    // Blob URLs are same-origin; next/image is not needed here
    // eslint-disable-next-line @next/next/no-img-element
    <img src={blobUrl} alt={fileName} className="max-h-[60vh] w-full object-contain" />
  );
};

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  fileName,
  filePath,
  documentType,
  status,
}) => {
  const kind = getPreviewKind(fileName, filePath);
  const title = formatDocumentType(documentType);
  const subtitle = fileName || "Uploaded file";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#F4F4F5]">
          <div className="min-w-0">
            <p className="text-xs text-[#707781] font-medium mb-1">{title}</p>
            <h3 className="text-lg font-bold text-[#2F3140] truncate">{subtitle}</h3>
            {status ? (
              <div className="mt-2">
                <StatusBadge
                  status={toKycBadgeStatus(status) as StatusType}
                  displayLabel={status}
                />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 p-2 rounded-xl hover:bg-[#F4F4F5] transition-colors"
          >
            <FiX size={20} className="text-[#2F3140]" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-auto bg-[#FAFAFA]">
          <div className="bg-white border border-[#F4F4F5] rounded-2xl min-h-80 flex items-center justify-center overflow-hidden">
            {!filePath ? (
              <p className="text-sm text-[#707781] p-8">No file was returned for this document.</p>
            ) : (
              <PreviewBody
                key={filePath}
                filePath={filePath}
                fileName={subtitle}
                kind={kind}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#F4F4F5]">
          <div className="w-28">
            <Button text="Close" variant="outline" onClick={onClose} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
