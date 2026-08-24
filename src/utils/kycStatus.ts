export const normalizeKycStatus = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

const normalize = normalizeKycStatus;

export const isPendingKycStatus = (value?: string | null) => {
  const status = normalizeKycStatus(value);
  return (
    !status ||
    status.includes("pending") ||
    status.includes("awaiting") ||
    status.includes("submitted") ||
    status.includes("review")
  );
};

export const isApprovedKycStatus = (value?: string | null) => {
  const status = normalizeKycStatus(value);
  return status.includes("approved") || status.includes("completed");
};

export const isRejectedKycStatus = (value?: string | null) => {
  const status = normalizeKycStatus(value);
  return status.includes("rejected") || status.includes("failed");
};

export const toKycBadgeStatus = (value?: string | null) => {
  if (isApprovedKycStatus(value)) return "Approved";
  if (isRejectedKycStatus(value)) return "Rejected";
  if (isPendingKycStatus(value)) return "Pending Verification";
  return value || "Pending Verification";
};

/** Roll up multiple KYC request statuses into one customer-level badge. */
export function rollupKycStatus(statuses: Array<string | null | undefined>): string | undefined {
  const normalized = statuses.map(normalize).filter(Boolean);
  if (normalized.length === 0) return undefined;

  if (normalized.some((status) => status.includes("pending") || status.includes("awaiting"))) {
    return "Pending";
  }
  if (normalized.some((status) => status === "approved" || status === "completed")) {
    return "Approved";
  }
  if (normalized.some((status) => status === "rejected" || status === "failed")) {
    return "Rejected";
  }

  return statuses.find(Boolean) as string | undefined;
}
